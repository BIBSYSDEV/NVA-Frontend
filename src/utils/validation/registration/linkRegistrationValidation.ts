import { TFunction } from 'i18next';
import * as Yup from 'yup';
import { doiUrlPlaceholder, isValidResourceLink } from '../../general-helpers';

export const getLinkRegistrationValidationSchema = (t: TFunction) =>
  Yup.object({
    link: Yup.string()
      .trim()
      .required(t('feedback.validation.is_required', { field: t('registration.registration.link_to_resource') }))
      .test(
        'is-valid-resource-link',
        t('feedback.validation.has_invalid_format_example', {
          field: t('registration.registration.link_to_resource'),
          example: doiUrlPlaceholder,
          interpolation: { escapeValue: false }, // The example is a URL, and its slashes must not be HTML escaped
        }),
        (value) => !value || isValidResourceLink(value)
      ),
  });
