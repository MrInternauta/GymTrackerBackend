export interface GenericResponse<T> {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T;
}
