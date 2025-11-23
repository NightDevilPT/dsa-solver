// API Response Interface
// Standard format for all API responses

export interface ApiResponse<T = any> {
  data: T | null;
  error: any | null;
  message: string;
  success: boolean;
  statusCode: number;
}


