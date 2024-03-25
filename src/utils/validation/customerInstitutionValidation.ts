import * as Yup from 'yup';
import i18n from '../../translations/i18n';

const customerErrorMessage = {
  rorInvalid: i18n.t('basic_data.institutions.invalid_ror_format'),
  doiNameRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('basic_data.institutions.doi_repo_id'),
  }),
  doiPrefixInvalid: i18n.t('basic_data.institutions.invalid_doi_prefix'),
  doiPrefixRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('basic_data.institutions.doi_prefix'),
  }),
};

export const customerInstitutionValidationSchema = Yup.object({
  canAssignDoi: Yup.boolean(),
  customer: Yup.object({
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
