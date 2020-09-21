import * as Yup from 'yup';
import { CustomerInstitutionFieldNames } from '../../types/customerInstitution.types';
import { ErrorMessage } from './errorMessage';

export const customerInstitutionValidationSchema = Yup.object().shape({
  [CustomerInstitutionFieldNames.NAME]: Yup.string().required(ErrorMessage.REQUIRED),
  [CustomerInstitutionFieldNames.DISPLAY_NAME]: Yup.string().required(ErrorMessage.REQUIRED),
  [CustomerInstitutionFieldNames.SHORT_NAME]: Yup.string().required(ErrorMessage.REQUIRED),
  [CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID]: Yup.string().required(ErrorMessage.REQUIRED),
});
