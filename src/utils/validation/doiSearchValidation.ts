import * as Yup from 'yup';
import { ErrorMessage } from './errorMessage';

export const doiValidationSchema = Yup.object().shape({
  doiUrl: Yup.string().trim().required(ErrorMessage.REQUIRED),
});

export const isValidUrl = (url: string) => Yup.string().url().isValidSync(url);
