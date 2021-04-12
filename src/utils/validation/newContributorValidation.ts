import * as Yup from 'yup';
import i18n from '../../translations/i18n';

const newContributorErrorMessage = {
  firstNameRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('common:first_name') }),
  lastNameRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:last_name'),
  }),
};

export const newContributorValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(newContributorErrorMessage.firstNameRequired),
  lastName: Yup.string().required(newContributorErrorMessage.lastNameRequired),
});
