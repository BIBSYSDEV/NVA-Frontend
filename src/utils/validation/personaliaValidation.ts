import * as Yup from 'yup';
import i18n from '../../translations/i18n';

// Ensures there are no numbers or special characters in the string
const nameRegexp = new RegExp(/^[^0-9&/\\#,+()$~%'":*?<>{}!@[\]]+$/);

export const personaliaValidationSchema = Yup.object().shape({
  preferredFirstName: Yup.string().matches(
    nameRegexp,
    i18n.t('feedback.validation.invalid_symbol_in_name', { field: i18n.t('my_page.my_profile.preferred_first_name') })
  ),
  preferredLastName: Yup.string().matches(
    nameRegexp,
    i18n.t('feedback.validation.invalid_symbol_in_name', { field: i18n.t('my_page.my_profile.preferred_first_name') })
  ),
  contactDetails: Yup.object().shape({
    telephone: Yup.string().matches(
      /^\+?[0-9\s]*$/,
      i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('my_page.my_profile.telephone') })
    ),
    email: Yup.string().email(i18n.t('feedback.validation.invalid_email')),
    webPage: Yup.string().url(
      i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('my_page.my_profile.personal_web_page') })
    ),
  }),
});
