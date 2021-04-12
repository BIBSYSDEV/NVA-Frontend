import * as Yup from 'yup';

export const doiValidationSchema = Yup.object().shape({
  doiUrl: Yup.string().trim().required(),
});

export const isValidUrl = (url: string) => Yup.string().url().isValidSync(url);
