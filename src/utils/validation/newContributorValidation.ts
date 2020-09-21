import * as Yup from 'yup';
import { ErrorMessage } from './errorMessage';

export const newContributorValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(ErrorMessage.REQUIRED),
  lastName: Yup.string().required(ErrorMessage.REQUIRED),
});
