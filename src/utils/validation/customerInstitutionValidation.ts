import * as Yup from 'yup';
import { CustomerInstitution, CustomerInstitutionFormData, DoiAgent } from '../../types/customerInstitution.types';
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
  doiPrefixInvalid: i18n.t('translation:basic_data.institutions.invalid_doi_prefix'),
  doiPrefixRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.doi_prefix'),
  }),
  doiUrlRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.doi_url'),
  }),
};

export const customerInstitutionValidationSchema = Yup.object<YupShape<CustomerInstitutionFormData>>({
  canAssignDoi: Yup.boolean(),
  customer: Yup.object<YupShape<CustomerInstitution>>({
    name: Yup.string().required(customerErrorMessage.institutionRequired),
    displayName: Yup.string().required(customerErrorMessage.displayNameRequired),
    shortName: Yup.string().required(customerErrorMessage.shortNameRequired),
    archiveName: Yup.string(),
    feideOrganizationDomain: Yup.string(),
    rorId: Yup.string().matches(/^https?:\/\/ror\.org\/([a-z0-9]{9})/, customerErrorMessage.rorInvalid),
  }),
  doiAgent: Yup.object().when('canAssignDoi', {
    is: true,
    then: () =>
      Yup.object<YupShape<DoiAgent>>({
        username: Yup.string().required(customerErrorMessage.doiNameRequired),
        prefix: Yup.string()
          .matches(/^10.(\d){4,9}$/, customerErrorMessage.doiPrefixInvalid)
          .required(customerErrorMessage.doiPrefixRequired),
        url: Yup.string().required(customerErrorMessage.doiUrlRequired),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
});
