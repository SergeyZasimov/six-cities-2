import request from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
}

export const errorHandler = ( error: unknown ): void => {
  if (!request.isAxiosError(error)) {
    throw error;
  }

  const { response } = error;

  if (response) {
    switch (response.status) {
      case StatusCodes.BAD_REQUEST:
        response.data.details
          ? response.data.details.forEach(( detail: ValidationErrorField ) => {
            detail.messages.forEach(( message: string ) => toast.error(message));
          })
          : toast.error(response.data.message);
        break;
      case StatusCodes.UNAUTHORIZED:
        toast.info(response.data.message);
        break;
      case StatusCodes.NOT_FOUND:
        toast.error(response.data.message);
        break;
      case StatusCodes.CONFLICT:
        toast.info(response.data.message);
        break;
    }
  }
};
