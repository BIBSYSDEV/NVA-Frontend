import * as Yup from 'yup';
import { ErrorMessage } from '../errorMessage';

export const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
  email: Yup.string().when('correspondingAuthor', {
    is: true,
    then: Yup.string().email(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
  }),
  sequence: Yup.number().min(0),
});
