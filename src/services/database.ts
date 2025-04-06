
import { Candidate, Settings } from '../types';

// Mock database with some initial data
let candidates: Candidate[] = [
  {
    id: 1,
    formNo: "24258",
    tokenNo: "59",
    name: "Faaz Ahmad",
    dob: "12-3-2013",
    contactNo: "9902700413",
    place: "Puttur",
    examDate: "21-04-2024",
    examTime: "12.00 - 1.30 pm"
  },
  {
    id: 2,
    formNo: "24259",
    tokenNo: "60",
    name: "Risha Khan",
    dob: "15-5-2012",
    contactNo: "9845123678",
    place: "Mangalore",
    examDate: "21-04-2024",
    examTime: "12.00 - 1.30 pm"
  },
  {
    id: 3,
    formNo: "24260",
    tokenNo: "61",
    name: "Zain Ali",
    dob: "28-1-2013",
    contactNo: "8875421369",
    place: "Bangalore",
    examDate: "21-04-2024",
    examTime: "2.00 - 3.30 pm"
  }
];

// Initial settings
let settings: Settings = {
  nextFormNumber: 24261,  // Starting from the next number after the last candidate
  nextTokenNumber: 62     // Starting from the next number after the last candidate
};

// Get all candidates
export const getAllCandidates = (): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...candidates]), 500);
  });
};

// Search candidates
export const searchCandidates = (query: string): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    const lowercaseQuery = query.toLowerCase();
    const results = candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowercaseQuery) ||
      candidate.formNo.toLowerCase().includes(lowercaseQuery) ||
      candidate.tokenNo.toLowerCase().includes(lowercaseQuery) ||
      candidate.place.toLowerCase().includes(lowercaseQuery)
    );
    setTimeout(() => resolve(results), 300);
  });
};

// Get paginated candidates
export const getPaginatedCandidates = (page: number, pageSize: number): Promise<{candidates: Candidate[], total: number}> => {
  return new Promise((resolve) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);
    setTimeout(() => resolve({
      candidates: paginatedCandidates,
      total: candidates.length
    }), 300);
  });
};

// Get candidate by id
export const getCandidateById = (id: number): Promise<Candidate | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const candidate = candidates.find(c => c.id === id);
      resolve(candidate);
    }, 300);
  });
};

// Add a new candidate
export const addCandidate = (candidate: Omit<Candidate, 'id' | 'formNo' | 'tokenNo'>): Promise<Candidate> => {
  return new Promise((resolve) => {
    const newId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
    
    // Use the next form and token numbers from settings
    const formNo = settings.nextFormNumber.toString();
    const tokenNo = settings.nextTokenNumber.toString();
    
    // Increment the settings
    settings.nextFormNumber++;
    settings.nextTokenNumber++;
    
    const newCandidate = { 
      ...candidate, 
      id: newId, 
      formNo, 
      tokenNo 
    };
    
    candidates = [newCandidate, ...candidates];
    setTimeout(() => resolve(newCandidate), 500);
  });
};

// Update an existing candidate
export const updateCandidate = (updatedCandidate: Candidate): Promise<Candidate> => {
  return new Promise((resolve, reject) => {
    const index = candidates.findIndex(c => c.id === updatedCandidate.id);
    
    if (index !== -1) {
      candidates[index] = updatedCandidate;
      setTimeout(() => resolve(updatedCandidate), 500);
    } else {
      setTimeout(() => reject(new Error("Candidate not found")), 500);
    }
  });
};

// Delete a candidate
export const deleteCandidate = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const initialLength = candidates.length;
    candidates = candidates.filter(c => c.id !== id);
    setTimeout(() => resolve(candidates.length < initialLength), 500);
  });
};

// Get settings
export const getSettings = (): Promise<Settings> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...settings}), 300);
  });
};

// Update settings
export const updateSettings = (newSettings: Settings): Promise<Settings> => {
  return new Promise((resolve) => {
    settings = {...newSettings};
    setTimeout(() => resolve({...settings}), 500);
  });
};
