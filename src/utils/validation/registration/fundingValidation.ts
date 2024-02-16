import * as Yup from 'yup';
import { fundingSourceIsNfr } from '../../../pages/registration/description_tab/projects_field/projectHelpers';
import i18n from '../../../translations/i18n';

const fundingErrorMessage = {
  fundingSourceRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.description.funding.funder'),
  }),
  fundingProjectRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.description.funding.funding_name'),
  }),
  fundingNfrProjectRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.description.funding.nfr_project'),
  }),
  fundingAmountMustBeAPositiveNumber: i18n.t('feedback.validation.must_be_a_positive_number', {
    field: i18n.t('registration.description.funding.funding_sum'),
  }),
};

export const fundingValidationSchema = Yup.object({
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
  fundingAmount: Yup.object().when(['source'], ([source], schema) =>
    fundingSourceIsNfr(source)
      ? schema.optional()
      : schema.shape({
          currency: Yup.string().defined(),
          amount: Yup.number()
            .transform((value, originalValue) => (/\s/.test(originalValue) ? NaN : value))
            .typeError(fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
            .min(0, fundingErrorMessage.fundingAmountMustBeAPositiveNumber)
            .required(fundingErrorMessage.fundingAmountMustBeAPositiveNumber),
        })
  ),
});

export const projectFundingValidationSchema = Yup.object({
  identifier: Yup.string().optional(),
  source: Yup.string().required(fundingErrorMessage.fundingSourceRequired),
});
