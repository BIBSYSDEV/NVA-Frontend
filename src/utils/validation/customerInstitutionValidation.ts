import * as Yup from 'yup';
import i18n from '../../translations/i18n';

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
    field: i18n.t('translation:basic_data.institutions.doi_repo_id'),
  }),
  doiPrefixInvalid: i18n.t('translation:basic_data.institutions.invalid_doi_prefix'),
  doiPrefixRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.institutions.doi_prefix'),
  }),
};

export const customerInstitutionValidationSchema = Yup.object({
  canAssignDoi: Yup.boolean(),
  customer: Yup.object({
    name: Yup.string().required(customerErrorMessage.institutionRequired),
    displayName: Yup.string().required(customerErrorMessage.displayNameRequired),
    shortName: Yup.string().required(customerErrorMessage.shortNameRequired),
    archiveName: Yup.string(),
    feideOrganizationDomain: Yup.string(),
    rorId: Yup.string().matches(/^https?:\/\/ror\.org\/([a-z0-9]{9})/, customerErrorMessage.rorInvalid),
  }),
  doiAgent: Yup.object().when('canAssignDoi', ([canAssignDoi], schema) =>
    canAssignDoi
      ? Yup.object({
          username: Yup.string().required(customerErrorMessage.doiNameRequired),
          prefix: Yup.string()
            .matches(/^10.(\d){4,9}$/, customerErrorMessage.doiPrefixInvalid)
            .required(customerErrorMessage.doiPrefixRequired),
          password: Yup.string().optional(), // Password in validated inline, on the Field component
        })
      : schema.nullable()
  ),
});
