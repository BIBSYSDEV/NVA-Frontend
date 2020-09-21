import * as Yup from 'yup';
import { ErrorMessage } from './errorMessage';

export const doiValidationSchema = Yup.object().shape({
  doiUrl: Yup.string().trim().url(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
});
