import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { PostCristinProject } from '../../../types/project.types';
import { YupShape } from '../validationHelpers';

const basicProjectErrorMessage = {
  coordinatingInstitution: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:project.coordinating_institution'),
  }),
  endDateCannotBeBeforeStart: i18n.t('translation:feedback.validation.cannot_be_before', {
    field: i18n.t('translation:common.end_date'),
    limitField: i18n.t('translation:common.start_date'),
  }),
  endDateRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.end_date'),
  }),
  endDateInvalidFormat: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:common.end_date'),
  }),
  institutionRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.institution'),
  }),
  personRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:project.person'),
  }),
  roleRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.role'),
  }),
  titleRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.title'),
  }),
  startDateRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.start_date'),
  }),
  startDateInvalidFormat: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:common.start_date'),
  }),
};

const contributorValidationSchema = Yup.object().shape({
  type: Yup.string().required(basicProjectErrorMessage.roleRequired),
  identity: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.personRequired) }),
  affiliation: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.institutionRequired) }),
});

export const basicProjectValidationSchema = Yup.object<YupShape<PostCristinProject>>().shape({
  title: Yup.string().required(basicProjectErrorMessage.titleRequired),
  startDate: Yup.date()
    .typeError(basicProjectErrorMessage.startDateInvalidFormat)
    .required(basicProjectErrorMessage.startDateRequired),
  endDate: Yup.date()
    .required(basicProjectErrorMessage.endDateRequired)
    .typeError(basicProjectErrorMessage.endDateInvalidFormat)
    .when('startDate', ([startDate], schema) =>
      startDate instanceof Date && !isNaN(startDate.getTime())
        ? schema.min(startDate, basicProjectErrorMessage.endDateCannotBeBeforeStart)
        : schema
    ),
  contributors: Yup.array().of(contributorValidationSchema),
  coordinatingInstitution: Yup.object().shape({
    id: Yup.string().required(basicProjectErrorMessage.coordinatingInstitution),
  }),
});
