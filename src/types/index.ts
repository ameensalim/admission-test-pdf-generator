
export interface Candidate {
  id: number;
  formNo: string;
  tokenNo: string;
  name: string;
  dob: string;
  contactNo: string;
  place: string;
  photo?: string;
  examDate?: string;
  examTime?: string;
}

export interface Settings {
  nextFormNumber: number;
  nextTokenNumber: number;
}
