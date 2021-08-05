import * as Yup from 'yup';
import { RegistrationStatus } from '../../../types/registration.types';
import i18n from '../../../translations/i18n';

const fileErrorMessage = {
  fileVersionRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:files_and_license.version'),
  }),
  licenseRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:files_and_license.conditions_for_using_file'),
  }),
  embargoDateInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:files_and_license.embargo_date'),
  }),
  embargoDateMustBeFuture: i18n.t('feedback:validation.must_be_in_future', {
    field: i18n.t('registration:files_and_license.embargo_date'),
  }),
};

export const fileValidationSchema = Yup.object().shape({
  administrativeAgreement: Yup.boolean(),
  embargoDate: Yup.date()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.date()
        .nullable()
        .when('$publicationStatus', {
          is: RegistrationStatus.Published,
          then: Yup.date().nullable().typeError(fileErrorMessage.embargoDateInvalid),
          otherwise: Yup.date()
            .nullable()
            .min(new Date(), fileErrorMessage.embargoDateMustBeFuture)
            .typeError(fileErrorMessage.embargoDateInvalid),
        }),
    }),
  publisherAuthority: Yup.boolean().when('administrativeAgreement', {
    is: false,
    then: Yup.boolean().nullable().required(fileErrorMessage.fileVersionRequired),
  }),
  license: Yup.object()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.object().nullable().required(fileErrorMessage.licenseRequired),
    }),
});
