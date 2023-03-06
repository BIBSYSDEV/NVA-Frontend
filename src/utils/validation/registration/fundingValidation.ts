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
  fundingAmountMustBeAPositiveNumber: i18n.t('translation:feedback.validation.must_be_a_positive_number', {
    field: i18n.t('translation:registration.description.funding.funding_sum'),
  }),
};

export const fundingValidationSchema = Yup.object<YupShape<Funding>>({
  source: Yup.string().required(fundingErrorMessage.fundingSourceRequired),
  id: Yup.string().test('test-id', fundingErrorMessage.fundingNfrProjectRequired, (value, context) => {
    const isNfrSource = fundingSourceIsNfr(context.parent.source ?? '');
    if (isNfrSource && !value) {
      return false;
    }
    return true;
  }),
  labels: Yup.object({
    nb: Yup.string().test('test-labels', fundingErrorMessage.fundingProjectRequired, (value, context) => {
      const isNfrSource = fundingSourceIsNfr(context.parent.source ?? '');
      if (!isNfrSource && !value) {
        return false;
      }
      return true;
    }),
  }),
  fundingAmount: Yup.object().when(['source'], (source: string, schema) =>
    fundingSourceIsNfr(source)
      ? schema
      : schema.shape({
          amount: Yup.number()
            .transform((value, originalValue) => (/\s/.test(originalValue) ? NaN : value))
            .typeError(fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
            .min(0, fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
            .required(fundingErrorMessage.fundingAmountMustBeAPositiveNumber),
        })
  ),
});
