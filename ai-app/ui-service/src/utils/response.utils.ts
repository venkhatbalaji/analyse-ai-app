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

export function createFailureResponse<T>(
  data: T,
  errorCode: ErrorMessage = ErrorMessage.BAD_REQUEST,
): ErrorResponse<T> {
  return {
    success: false,
    errorCode: errorCode,
    data,
  };
}
