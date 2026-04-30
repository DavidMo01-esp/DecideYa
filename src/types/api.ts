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

export interface ApiErrorResponse {
  error: string;
}

export interface ApiValidationErrorResponse {
  errors: ValidationError[];
}

interface ApiClientErrorOptions {
  message: string;
  statusCode: number;
  validationErrors?: ValidationError[];
}

export class ApiClientError extends Error {
  readonly statusCode: number;
  readonly validationErrors: ValidationError[];

  constructor({
    message,
    statusCode,
    validationErrors = [],
  }: ApiClientErrorOptions) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

export type NetworkState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export type DecisionListResponse = Decision[];
export type DecisionResponse = Decision;
export type DeleteResponse = void;
