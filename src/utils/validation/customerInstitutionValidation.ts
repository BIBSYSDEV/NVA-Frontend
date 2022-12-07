import * as Yup from 'yup';
import { CustomerInstitution, CustomerInstitutionFieldNames, DoiAgent } from '../../types/customerInstitution.types';
import i18n from '../../translations/i18n';
import { YupShape } from './validationHelpers';

const customerErrorMessage = {
  displayNameRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.display_name'),
  }),
  institutionRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.institution'),
  }),
  shortNameRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.short_name'),
  }),
  rorInvalid: i18n.t('translation:basic_data.institutions.invalid_ror_format'),
  doiNameRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.doi_name'),
  }),
  doiPrefixRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.doi_prefix'),
  }),
};

export const customerInstitutionValidationSchema = Yup.object<YupShape<CustomerInstitution>>({
  [CustomerInstitutionFieldNames.Name]: Yup.string().required(customerErrorMessage.institutionRequired),
  [CustomerInstitutionFieldNames.DisplayName]: Yup.string().required(customerErrorMessage.displayNameRequired),
  [CustomerInstitutionFieldNames.ShortName]: Yup.string().required(customerErrorMessage.shortNameRequired),
  [CustomerInstitutionFieldNames.ArchiveName]: Yup.string(),
  [CustomerInstitutionFieldNames.FeideOrganizationDomain]: Yup.string(),
  [CustomerInstitutionFieldNames.RorId]: Yup.string().matches(
    /^https?:\/\/ror\.org\/([a-z0-9]{9})/,
    customerErrorMessage.rorInvalid
  ),
  doiAgent: Yup.object()
    .nullable()
    .when(CustomerInstitutionFieldNames.CanAssignDoi, {
      is: true,
      then: Yup.object<YupShape<DoiAgent>>({
        name: Yup.string().required(customerErrorMessage.doiNameRequired),
        prefix: Yup.string().required(customerErrorMessage.doiPrefixRequired),
      }),
    }),
});
