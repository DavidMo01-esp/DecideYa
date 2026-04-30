export interface Decision {
  id: string;
  title: string;
  options: string[];
  selectedOption: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDecisionDTO {
  title: string;
  options: string[];
  selectedOption?: string | null;
}

export interface UpdateDecisionDTO {
  title?: string;
  options?: string[];
  selectedOption?: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}
