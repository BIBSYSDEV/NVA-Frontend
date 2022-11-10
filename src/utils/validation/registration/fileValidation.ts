import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { YupShape } from '../validationHelpers';
import { AssociatedFile, AssociatedLink } from '../../../types/file.types';

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
};

export const associatedFileValidationSchema = Yup.object<YupShape<AssociatedFile>>({
  administrativeAgreement: Yup.boolean(),
  embargoDate: Yup.date()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.date().nullable().typeError(associatedArtifactErrorMessage.embargoDateInvalid),
    }),
  publisherAuthority: Yup.boolean()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.boolean().nullable().required(associatedArtifactErrorMessage.fileVersionRequired),
    }),
  license: Yup.object()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.object().nullable().required(associatedArtifactErrorMessage.licenseRequired),
    }),
});

export const associatedLinkValidationSchema = Yup.object<YupShape<AssociatedLink>>({
  id: Yup.string().url(),
});
