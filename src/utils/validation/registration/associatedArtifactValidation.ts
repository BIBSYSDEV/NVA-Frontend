import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  isTypeWithFileVersionField,
} from '../../registration-helpers';

const associatedArtifactErrorMessage = {
  fileVersionRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.version'),
  }),
  licenseRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.files_and_license.conditions_for_using_file'),
  }),
  embargoDateInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.files_and_license.file_publish_date'),
  }),
  linkInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.files_and_license.link_to_resource'),
  }),
};

export const associatedFileValidationSchema = Yup.object({
  type: Yup.string(),

  // File validation
  administrativeAgreement: Yup.boolean().nullable(),
  embargoDate: Yup.date()
    .nullable()
    .when(['type', 'administrativeAgreement'], {
      is: (type: string, administrativeAgreement: boolean) =>
        associatedArtifactIsFile({ type }) && administrativeAgreement === false,
      then: (schema) => schema.typeError(associatedArtifactErrorMessage.embargoDateInvalid),
    }),
  publisherAuthority: Yup.boolean()
    .nullable()
    .when(['type', 'administrativeAgreement', '$contentType'], {
      is: (type: string, administrativeAgreement: boolean, contentType: string | null) =>
        associatedArtifactIsFile({ type }) && administrativeAgreement === false && isTypeWithFileVersionField(type),
      then: (schema) => schema.required(associatedArtifactErrorMessage.fileVersionRequired),
    }),
  license: Yup.object()
    .nullable()
    .when(['type', 'administrativeAgreement'], {
      is: (type: string, administrativeAgreement: boolean) =>
        associatedArtifactIsFile({ type }) && administrativeAgreement === false,
      then: (schema) => schema.required(associatedArtifactErrorMessage.licenseRequired),
    }),

  // Link validation
  id: Yup.string()
    .nullable()
    .when('type', {
      is: (type: string) => associatedArtifactIsLink({ type }),
      then: (schema) => schema.url(associatedArtifactErrorMessage.linkInvalid),
    }),
});
