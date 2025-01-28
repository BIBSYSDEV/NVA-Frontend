import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { FileType, FileVersion } from '../../../types/associatedArtifact.types';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  isOpenFile,
  isPendingOpenFile,
  isTypeWithFileVersionField,
} from '../../registration-helpers';

const associatedArtifactErrorMessage = {
  availabilityRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.files_and_license.availability'),
  }),
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

const linkValidation = Yup.string()
  .nullable()
  .when('type', ([type], schema) =>
    associatedArtifactIsLink({ type }) ? schema.url(associatedArtifactErrorMessage.linkInvalid) : schema
  );

const validFileTypes = Object.values(FileType).filter((type) => type !== FileType.UpdloadedFile);

export const associatedArtifactValidationSchema = Yup.object({
  type: Yup.string()
    .oneOf(validFileTypes, associatedArtifactErrorMessage.availabilityRequired)
    .required(associatedArtifactErrorMessage.availabilityRequired),
  embargoDate: Yup.date()
    .nullable()
    .when(['type'], ([type], schema) =>
      associatedArtifactIsFile({ type }) && (isOpenFile({ type }) || isPendingOpenFile({ type }))
        ? schema.typeError(associatedArtifactErrorMessage.embargoDateInvalid)
        : schema
    ),
  publisherVersion: Yup.string()
    .nullable()
    .when(['type', '$publicationInstanceType'], ([type, publicationInstanceType], schema) =>
      associatedArtifactIsFile({ type }) &&
      (isOpenFile({ type }) || isPendingOpenFile({ type })) &&
      isTypeWithFileVersionField(publicationInstanceType)
        ? schema
            .required(associatedArtifactErrorMessage.fileVersionRequired)
            .oneOf([FileVersion.Published, FileVersion.Accepted], associatedArtifactErrorMessage.fileVersionRequired)
        : schema
    ),
  license: Yup.string()
    .nullable()
    .when(['type'], ([type], schema) =>
      associatedArtifactIsFile({ type }) && (isOpenFile({ type }) || isPendingOpenFile({ type }))
        ? schema.required(associatedArtifactErrorMessage.licenseRequired)
        : schema
    ),
  id: linkValidation,
});

export const associatedArtifactPublishValidationSchema = Yup.object({
  type: Yup.string(),
  id: linkValidation,
});
