import * as Yup from 'yup';
import { isProjectManagerRole } from '../../../pages/project/helpers/projectContributorRoleHelpers';
import i18n from '../../../translations/i18n';
import { ProjectContributor, SaveCristinProject } from '../../../types/project.types';
import { projectFundingValidationSchema } from '../registration/fundingValidation';
import { YupShape } from '../validationHelpers';

const basicProjectErrorMessage = {
  coordinatingInstitution: i18n.t('feedback.validation.is_required', {
    field: i18n.t('project.coordinating_institution'),
  }),
  endDateCannotBeBeforeStart: i18n.t('feedback.validation.cannot_be_before', {
    field: i18n.t('common.end_date'),
    limitField: i18n.t('common.start_date'),
  }),
  endDateRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('common.end_date'),
  }),
  endDateInvalidFormat: i18n.t('feedback.validation.has_invalid_format', {
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
  startDateInvalidFormat: i18n.t('feedback.validation.has_invalid_format', {
    field: i18n.t('common.start_date'),
  }),
  contributorRequired: i18n.t('feedback.validation.contributor_required_project'),
  mustHaveAProjectManager: i18n.t('feedback.validation.project_manager_required_project'),
};

const roleValidationSchema = Yup.object().shape({
  type: Yup.string().required(basicProjectErrorMessage.roleRequired),
  affiliation: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.institutionRequired) }),
});

const contributorValidationSchema = Yup.object().shape({
  identity: Yup.object().shape({ id: Yup.string().required(basicProjectErrorMessage.personRequired) }),
  roles: Yup.array().of(roleValidationSchema),
});

export const basicProjectValidationSchema = Yup.object<YupShape<SaveCristinProject>>().shape({
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
  contributors:
    Yup.array().min(1, basicProjectErrorMessage.contributorRequired).of(contributorValidationSchema) &&
    Yup.array()
      .compact((contributor: ProjectContributor) => !contributor.roles.some((role) => isProjectManagerRole(role)))
      .min(1, basicProjectErrorMessage.mustHaveAProjectManager),
  coordinatingInstitution: Yup.object().shape({
    id: Yup.string().required(basicProjectErrorMessage.coordinatingInstitution),
  }),
  funding: Yup.array().of(projectFundingValidationSchema),
});
