
import { supabase } from '../integrations/supabase/client';
import { Candidate, Settings } from '../types';

// Get all candidates
export const getAllCandidates = async (): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
  
  return data.map(mapToCandidateModel);
};

// Search candidates
export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  const lowercaseQuery = query.toLowerCase();
  
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .or(`name.ilike.%${lowercaseQuery}%,form_no.ilike.%${lowercaseQuery}%,token_no.ilike.%${lowercaseQuery}%,place.ilike.%${lowercaseQuery}%`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error searching candidates:", error);
    throw error;
  }
  
  return data.map(mapToCandidateModel);
};

// Get paginated candidates
export const getPaginatedCandidates = async (page: number, pageSize: number): Promise<{candidates: Candidate[], total: number}> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('applications')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
  
  if (error) {
    console.error("Error fetching paginated candidates:", error);
    throw error;
  }
  
  return {
    candidates: data.map(mapToCandidateModel),
    total: count || 0
  };
};

// Get candidate by id
export const getCandidateById = async (id: number): Promise<Candidate | undefined> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned, candidate not found
      return undefined;
    }
    console.error("Error fetching candidate by ID:", error);
    throw error;
  }
  
  return mapToCandidateModel(data);
};

// Add a new candidate
export const addCandidate = async (candidate: Omit<Candidate, 'id' | 'form_no' | 'token_no' | 'created_at' | 'updated_at'>): Promise<Candidate> => {
  // First get settings to know the next form number and token number
  const settings = await getSettings();
  
  const newCandidate = {
    form_no: settings.nextFormNumber.toString(),
    token_no: settings.nextTokenNumber.toString(),
    name: candidate.name,
    dob: candidate.dob,
    contact_no: candidate.contactNo || '',
    place: candidate.place,
    examDate: candidate.examDate,
    examTime: candidate.examTime
  };
  
  const { data, error } = await supabase
    .from('applications')
    .insert([newCandidate])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding candidate:", error);
    throw error;
  }
  
  // After successfully adding candidate, increment the settings
  await updateSettings({
    nextFormNumber: settings.nextFormNumber + 1,
    nextTokenNumber: settings.nextTokenNumber + 1
  });
  
  return mapToCandidateModel(data);
};

// Update an existing candidate
export const updateCandidate = async (updatedCandidate: Candidate): Promise<Candidate> => {
  const { id, ...candidateData } = updatedCandidate;
  
  // Map to database model
  const dbCandidate = {
    form_no: candidateData.form_no,
    token_no: candidateData.token_no,
    name: candidateData.name,
    dob: candidateData.dob,
    contact_no: candidateData.contactNo || '',
    place: candidateData.place,
    // We don't update created_at or updated_at as they're handled by the database
  };
  
  const { data, error } = await supabase
    .from('applications')
    .update(dbCandidate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating candidate:", error);
    throw error;
  }
  
  return mapToCandidateModel(data);
};

// Delete a candidate
export const deleteCandidate = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
  
  return true;
};

// Settings table doesn't exist in the database, so we'll store it in localStorage
const SETTINGS_KEY = "admission_test_app_settings";

// Get settings
export const getSettings = async (): Promise<Settings> => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY);
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }
  
  // Default settings if none exist
  const defaultSettings: Settings = {
    nextFormNumber: 24261, // Default starting values
    nextTokenNumber: 62     // Default starting values
  };
  
  // Save default settings
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  
  return defaultSettings;
};

// Update settings
export const updateSettings = async (newSettings: Settings): Promise<Settings> => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  return newSettings;
};

// Helper function to map database model to our application model
function mapToCandidateModel(dbRecord: any): Candidate {
  return {
    id: dbRecord.id,
    form_no: dbRecord.form_no,
    token_no: dbRecord.token_no,
    name: dbRecord.name,
    dob: dbRecord.dob,
    contactNo: dbRecord.contact_no,
    place: dbRecord.place,
    examDate: dbRecord.examDate,
    examTime: dbRecord.examTime,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}
