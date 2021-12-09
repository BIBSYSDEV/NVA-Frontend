import * as Yup from 'yup';
import { CustomerInstitutionFieldNames } from '../../types/customerInstitution.types';
import i18n from '../../translations/i18n';

const customerErrorMessage = {
  displayNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('admin:display_name') }),
  feideIdRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('admin:feide_organization_id') }),
  institutionRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('common:institution') }),
  shortNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('admin:short_name') }),
};

export const customerInstitutionValidationSchema = Yup.object().shape({
  [CustomerInstitutionFieldNames.Name]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DisplayName]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.ShortName]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ArchiveName]: Yup.string(),
  [CustomerInstitutionFieldNames.FeideOrganizationId]: Yup.string().required(customerErrorMessage.feideIdRequired),
});

export const myInstitutionValidationSchema = Yup.object().shape({
  [CustomerInstitutionFieldNames.Name]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DisplayName]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.ShortName]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ArchiveName]: Yup.string(),
});
