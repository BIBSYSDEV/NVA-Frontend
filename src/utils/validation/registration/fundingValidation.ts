import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { Funding } from '../../../types/registration.types';
import { fundingSourceIsNfr } from '../../registration-helpers';

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

export const fundingValidationSchema: Yup.ObjectSchema<Funding> = Yup.object({
  type: Yup.string<'ConfirmedFunding' | 'UnconfirmedFunding'>().defined(),
  identifier: Yup.string().optional(),
  activeFrom: Yup.string().optional(),
  activeTo: Yup.string().optional(),
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
  fundingAmount: Yup.object({
    currency: Yup.string().defined(),
    amount: Yup.number()
      .typeError(fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
      .min(0, fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
      .required(fundingErrorMessage.fundingAmountMustBeAPositiveNumber),
  }),
});
