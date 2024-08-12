import { ErrorMessage } from './error.utils';

export interface Response<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse<T> {
  success: boolean;
  data: T;
  errorCode: ErrorMessage;
}

export function createSuccessResponse<T>(data: T): Response<T> {
  return {
    success: true,
    data,
  };
}