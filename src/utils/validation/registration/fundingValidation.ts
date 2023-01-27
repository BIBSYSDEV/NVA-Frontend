import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { Funding } from '../../../types/registration.types';
import { fundingSourceIsNfr } from '../../registration-helpers';
import { YupShape } from '../validationHelpers';

const fundingErrorMessage = {
  fundingSourceRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.description.funding.funder'),
  }),
  fundingProjectRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.description.funding.project'),
  }),
  fundingNfrProjectRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.description.funding.nfr_project'),
  }),
};

export const fundingValidationSchema = Yup.object<YupShape<Funding>>({
  source: Yup.string().required(fundingErrorMessage.fundingSourceRequired),
  id: Yup.string().when('source', {
    is: (source: string) => fundingSourceIsNfr(source),
    then: (schema) => schema.required(fundingErrorMessage.fundingNfrProjectRequired),
    otherwise: (schema) => schema,
  }),
  labels: Yup.object().when('source', {
    is: (source: string) => !fundingSourceIsNfr(source),
    then: (schema) => schema.shape({ nb: Yup.string().required(fundingErrorMessage.fundingProjectRequired) }),
    otherwise: (schema) => schema,
  }),
});
