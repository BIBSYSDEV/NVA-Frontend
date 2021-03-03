import * as Yup from 'yup';

export const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
});
