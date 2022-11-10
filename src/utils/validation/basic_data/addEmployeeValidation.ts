import * as Yup from 'yup';
import { AddAdminFormData } from '../../../pages/basic_data/app_admin/AddAdminDialog';
import { AddEmployeeData } from '../../../pages/basic_data/institution_admin/AddEmployeePage';
import { PersonData } from '../../../pages/basic_data/institution_admin/person_register/PersonTableRow';
import i18n from '../../../translations/i18n';
import { Employment, FlatCristinPerson } from '../../../types/user.types';
import { YupShape } from '../validationHelpers';

const employeeErrorMessage = {
  firstNameRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.first_name'),
  }),
  firstNameInvalidFormat: i18n.t('translation:feedback.validation.invalid_symbol_in_name', {
    field: i18n.t('translation:common.first_name'),
  }),
  lastNameRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.last_name'),
  }),
  lastNameInvalidFormat: i18n.t('translation:feedback.validation.invalid_symbol_in_name', {
    field: i18n.t('translation:common.last_name'),
  }),
  affiliationTypeRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.add_employee.position'),
  }),
  affiliationOrganizationRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.institution'),
  }),
  affiliationPercentageRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.add_employee.position_percent'),
  }),
  affiliationPercentageMax: i18n.t('translation:feedback.validation.must_be_smaller_than', {
    field: i18n.t('translation:basic_data.add_employee.position_percent'),
    limit: 100,
  }),
  affiliationPercentageMin: i18n.t('translation:feedback.validation.must_be_bigger_than', {
    field: i18n.t('translation:basic_data.add_employee.position_percent'),
    limit: 0,
  }),
  affiliationStartDateInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:common.start_date'),
  }),
  affiliationStartDateRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.start_date'),
  }),
  affiliationEndDateAfterStart: i18n.t('translation:feedback.validation.cannot_be_before', {
    field: i18n.t('translation:common.end_date'),
    limitField: i18n.t('translation:common.start_date').toLowerCase(),
  }),
  affiliationEndDateInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:common.end_date'),
  }),
  nationalIdInvalid: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:basic_data.person_register.national_identity_number'),
  }),
  nationalIdInvalidFormat: i18n.t('translation:feedback.validation.invalid_number_of_digits', {
    field: i18n.t('translation:basic_data.person_register.national_identity_number'),
    digits: 11,
  }),
};

// Ensures there are no numbers or special characters in the string
const nameRegexp = new RegExp(/^[^\d&/\\#,+()$~%.'":*?<>{}!@[\]]{2,}$/);

export const userValidationSchema = Yup.object<YupShape<FlatCristinPerson>>({
  firstName: Yup.string()
    .matches(nameRegexp, employeeErrorMessage.firstNameInvalidFormat)
    .required(employeeErrorMessage.firstNameRequired),
  lastName: Yup.string()
    .matches(nameRegexp, employeeErrorMessage.lastNameInvalidFormat)
    .required(employeeErrorMessage.lastNameRequired),
  nationalId: Yup.string()
    .matches(/^\d{11}$/, employeeErrorMessage.nationalIdInvalidFormat)
    .required(employeeErrorMessage.nationalIdInvalid),
});

const employmentValidation = Yup.object<YupShape<Employment>>({
  type: Yup.string().required(employeeErrorMessage.affiliationTypeRequired),
  organization: Yup.string().required(employeeErrorMessage.affiliationOrganizationRequired),
  fullTimeEquivalentPercentage: Yup.number()
    .min(0, employeeErrorMessage.affiliationPercentageMin)
    .max(100, employeeErrorMessage.affiliationPercentageMax)
    .required(employeeErrorMessage.affiliationPercentageRequired),
  startDate: Yup.date()
    .required(employeeErrorMessage.affiliationStartDateRequired)
    .typeError(employeeErrorMessage.affiliationStartDateInvalid),
  endDate: Yup.date()
    .typeError(employeeErrorMessage.affiliationEndDateInvalid)
    .when('startDate', (startDate, schema) =>
      startDate instanceof Date && !isNaN(startDate.getTime())
        ? schema.min(startDate, employeeErrorMessage.affiliationEndDateAfterStart)
        : schema
    ),
});

export const addEmployeeValidationSchema = Yup.object<YupShape<AddEmployeeData>>({
  user: userValidationSchema,
  affiliation: employmentValidation,
});

export const addCustomerAdminValidationSchema = Yup.object<YupShape<AddAdminFormData>>({
  startDate: Yup.date()
    .required(employeeErrorMessage.affiliationStartDateRequired)
    .typeError(employeeErrorMessage.affiliationStartDateInvalid),
  position: Yup.string().required(employeeErrorMessage.affiliationTypeRequired),
});

export const personDataValidationSchema = Yup.object<YupShape<PersonData>>({
  employments: Yup.array().of(employmentValidation),
});
