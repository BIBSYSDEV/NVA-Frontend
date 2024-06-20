import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { FileVersion } from '../../../types/associatedArtifact.types';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  isTypeWithFileVersionField,
} from '../../registration-helpers';

const associatedArtifactErrorMessage = {
  fileVersionRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.version'),
  }),
  licenseRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.files_and_license.conditions_for_using_file'),
  }),
  embargoDateInvalid: i18n.t('feedback.validation.has_invalid_format', {
    field: i18n.t('registration.files_and_license.embargo'),
    interpolation: { escapeValue: false },
  }),
  linkInvalid: i18n.t('feedback.validation.has_invalid_format', {
    field: i18n.t('registration.files_and_license.link_to_resource'),
  }),
};

export const associatedFileValidationSchema = Yup.object({
  type: Yup.string(),

  // File validation
  embargoDate: Yup.date()
    .nullable()
    .when(['type'], ([type], schema) =>
      associatedArtifactIsFile({ type }) && type !== 'UnpublishableFile'
        ? schema.typeError(associatedArtifactErrorMessage.embargoDateInvalid)
        : schema
    ),
  publisherVersion: Yup.string()
    .nullable()
    .when(['type', '$publicationInstanceType'], ([type, publicationInstanceType], schema) =>
      associatedArtifactIsFile({ type }) &&
      type !== 'UnpublishableFile' &&
      isTypeWithFileVersionField(publicationInstanceType)
        ? schema
            .required(associatedArtifactErrorMessage.fileVersionRequired)
            .oneOf([FileVersion.Published, FileVersion.Accepted], associatedArtifactErrorMessage.fileVersionRequired)
        : schema
    ),
  license: Yup.string()
    .nullable()
    .when(['type'], ([type], schema) =>
      associatedArtifactIsFile({ type }) && type !== 'UnpublishableFile'
        ? schema.required(associatedArtifactErrorMessage.licenseRequired)
        : schema
    ),
  // Link validation
  id: Yup.string()
    .nullable()
    .when('type', ([type], schema) =>
      associatedArtifactIsLink({ type }) ? schema.url(associatedArtifactErrorMessage.linkInvalid) : schema
    ),
});
