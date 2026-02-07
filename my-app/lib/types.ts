/**
 * Types for PharmaShe Drug Analysis Platform
 */

export interface Drug {
  name: string;
  activeIngredients?: string[];
  dosageForm?: string;
  route?: string;
  manufacturer?: string;
}

export interface AnalysisRequest {
  drugs: string[];
  context?: string;
}

export interface AnalysisResponse {
  success: boolean;
  drugs: string[];
  analysis: string;
  timestamp?: string;
}

export interface WomenHealthContext {
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
  isOnHormoneTherapy?: boolean;
  isOnContraceptives?: boolean;
  additionalContext?: string;
}

export interface APIError {
  error: string;
  details?: string;
  status?: number;
}
