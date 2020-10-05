import * as Yup from 'yup';
import { ErrorMessage } from '../errorMessage';
import { PublicationStatus } from '../../../types/publication.types';

export const fileValidationSchema = Yup.object().shape({
  administrativeAgreement: Yup.boolean(),
  embargoDate: Yup.date()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.date()
        .nullable()
        .when('$publicationStatus', {
          is: PublicationStatus.PUBLISHED,
          then: Yup.date().nullable().typeError(ErrorMessage.INVALID_FORMAT),
          otherwise: Yup.date()
            .nullable()
            .min(new Date(), ErrorMessage.MUST_BE_FUTURE)
            .typeError(ErrorMessage.INVALID_FORMAT),
        }),
    }),
  publisherAuthority: Yup.boolean()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.boolean().required(ErrorMessage.REQUIRED),
    }),
  license: Yup.object()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.object().required(ErrorMessage.REQUIRED),
    }),
});
