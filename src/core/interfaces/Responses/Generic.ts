export interface GenericResponse<T> {
  statusCode?: number;
  message?: string | Array<string>;
  error?: string;
  data?: T;
}
