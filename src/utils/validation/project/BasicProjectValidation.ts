import * as Yup from 'yup';
import i18n from '../../../translations/i18n';

const basicProjectErrorMessage = {
  contributorRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('project:project_manager'),
  }),
  titleRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:title'),
  }),
  startDateRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('project:start_date'),
  }),
  institutionRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:institution'),
  }),
};

export const basicProjectValidationSchema = Yup.object().shape({
  title: Yup.string().required(basicProjectErrorMessage.titleRequired),
  startDate: Yup.date().required(basicProjectErrorMessage.startDateRequired),
  contributors: Yup.array().min(1, basicProjectErrorMessage.contributorRequired),
  coordinatingInstitution: Yup.object().shape({
    id: Yup.string().required(basicProjectErrorMessage.institutionRequired),
  }),
});
