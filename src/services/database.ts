
import { Candidate } from '../types';

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

// Get all candidates
export const getAllCandidates = (): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...candidates]), 500);
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
export const addCandidate = (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
  return new Promise((resolve) => {
    const newId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
    const newCandidate = { ...candidate, id: newId };
    candidates = [...candidates, newCandidate];
    setTimeout(() => resolve(newCandidate), 500);
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
