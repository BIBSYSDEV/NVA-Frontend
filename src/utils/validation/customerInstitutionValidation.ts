import * as Yup from 'yup';
import { CustomerInstitutionFieldNames } from '../../types/customerInstitution.types';
import i18n from '../../translations/i18n';

const customerErrorMessage = {
  displayNameRequired: i18n.t('feedback:validation.common.is_required', { field: i18n.t('admin:display_name') }),
  feideIdRequired: i18n.t('feedback:validation.common.is_required', { field: i18n.t('admin:feide_organization_id') }),
  institutionRequired: i18n.t('feedback:validation.common.is_required', { field: i18n.t('admin:institution') }),
  shortNameRequired: i18n.t('feedback:validation.common.is_required', { field: i18n.t('admin:short_name') }),
};

export const customerInstitutionValidationSchema = Yup.object().shape({
  [CustomerInstitutionFieldNames.NAME]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DISPLAY_NAME]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.SHORT_NAME]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ARCHIVE_NAME]: Yup.string(),
  [CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID]: Yup.string().required(customerErrorMessage.feideIdRequired),
});

export const myInstitutionValidationSchema = Yup.object().shape({
  [CustomerInstitutionFieldNames.NAME]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DISPLAY_NAME]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.SHORT_NAME]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ARCHIVE_NAME]: Yup.string(),
});
