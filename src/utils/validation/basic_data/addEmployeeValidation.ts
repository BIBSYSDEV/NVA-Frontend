import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { validateDateInterval } from '../validationHelpers';

const employeeErrorMessage = {
  firstNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('common:first_name') }),
  lastNameRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:last_name'),
  }),
  affiliationTypeRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('basicData:add_employee.position'),
  }),
  affiliationOrganizationRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:institution'),
  }),
  affiliationPercentageRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('basicData:add_employee.position_percent'),
  }),
  affiliationPercentageMax: i18n.t('feedback:validation.must_be_smaller_than', {
    field: i18n.t('basicData:add_employee.position_percent'),
    limit: 100,
  }),
  affiliationPercentageMin: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('basicData:add_employee.position_percent'),
    limit: 0,
  }),
  affiliationStartDateRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:start_date'),
  }),
  affiliationStartDateBeforeEnd: i18n.t('feedback:validation.cannot_be_after', {
    field: i18n.t('common:start_date'),
    limitField: i18n.t('common:end_date').toLowerCase(),
  }),
  affiliationEndDateAfterStart: i18n.t('feedback:validation.cannot_be_before', {
    field: i18n.t('common:end_date'),
    limitField: i18n.t('common:start_date').toLowerCase(),
  }),
  affiliationEndDateRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:end_date'),
  }),
};

export const userValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(employeeErrorMessage.firstNameRequired),
  lastName: Yup.string().required(employeeErrorMessage.lastNameRequired),
  nationalId: Yup.string().required(),
});

export const addEmployeeValidationSchema = Yup.object().shape({
  user: userValidationSchema,
  affiliation: Yup.object().shape({
    type: Yup.string().required(employeeErrorMessage.affiliationTypeRequired),
    organization: Yup.string().required(employeeErrorMessage.affiliationOrganizationRequired),
    fullTimeEquivalentPercentage: Yup.number()
      .min(0, employeeErrorMessage.affiliationPercentageMin)
      .max(100, employeeErrorMessage.affiliationPercentageMax)
      .required(employeeErrorMessage.affiliationPercentageRequired),
    startDate: Yup.string()
      .test('start-test', employeeErrorMessage.affiliationStartDateBeforeEnd, (startValue, context) =>
        validateDateInterval(startValue, context.parent.endDate)
      )
      .required(employeeErrorMessage.affiliationStartDateRequired),
    endDate: Yup.string().test('end-test', employeeErrorMessage.affiliationEndDateAfterStart, (endValue, context) =>
      validateDateInterval(context.parent.startDate, endValue)
    ),
  }),
});

export const addCustomerAdminValidationSchema = Yup.object().shape({
  startDate: Yup.date().required(employeeErrorMessage.affiliationStartDateRequired),
  position: Yup.string().required(employeeErrorMessage.affiliationTypeRequired),
});
