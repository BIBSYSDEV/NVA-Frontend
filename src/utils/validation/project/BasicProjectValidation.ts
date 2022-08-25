import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { PostCristinProject } from '../../../types/project.types';
import { YupShape } from '../validationHelpers';

const basicProjectErrorMessage = {
  coordinatingInstitution: i18n.t('feedback.validation.is_required', {
    field: i18n.t('project.coordinating_institution'),
  }),
  endDateRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.end_date'),
  }),
  institutionRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.institution'),
  }),
  personRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('project.person'),
  }),
  roleRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.role'),
  }),
  titleRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.title'),
  }),
  startDateRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.start_date'),
  }),
};

const contributorValidationSchema = Yup.object().shape({
  type: Yup.string().required(basicProjectErrorMessage.roleRequired),
  identity: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.personRequired) }),
  affiliation: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.institutionRequired) }),
});

export const basicProjectValidationSchema = Yup.object<YupShape<PostCristinProject>>().shape({
  title: Yup.string().required(basicProjectErrorMessage.titleRequired),
  startDate: Yup.date().required(basicProjectErrorMessage.startDateRequired),
  endDate: Yup.date().required(basicProjectErrorMessage.endDateRequired),
  contributors: Yup.array().of(contributorValidationSchema),
  coordinatingInstitution: Yup.object().shape({
    id: Yup.string().required(basicProjectErrorMessage.coordinatingInstitution),
  }),
});
