import { ApplicationError } from '@/protocols';

export function hotelsUnableToListError(): ApplicationError {
  return {
    name: 'CannotListHotelsError',
    message: 'Cannot list hotels!',
  };
}