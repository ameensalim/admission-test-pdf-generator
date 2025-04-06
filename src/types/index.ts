export interface Candidate {
  id?: number;
  form_no?: string;
  token_no?: string;
  name: string;
  dob: string;
  contact_no: string;
  place: string;
  created_at?: string;
  updated_at?: string;
}

export interface candiateInput {
  name: string;
  dob: string;
  contactNo: string;
  place: string;
  photo?: string;
}

export interface Settings {
  nextFormNumber: number;
  nextTokenNumber: number;
}
