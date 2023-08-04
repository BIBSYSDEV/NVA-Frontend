import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { isValidUrl } from '../../../utils/general-helpers';

enum LinkRegistrationFormFieldName {
  Link = 'link',
}

const doiValidationSchema = Yup.object({
  [LinkRegistrationFormFieldName.Link]: Yup.string().trim().required(),
});

interface DoiFormValues {
  [LinkRegistrationFormFieldName.Link]: string;
}

const emptyDoiFormValues: DoiFormValues = {
  [LinkRegistrationFormFieldName.Link]: '',
};

const doiUrlBase = 'https://doi.org/';
const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;
const doiRegExp = new RegExp('\\b(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'<>])\\S)+)\\b'); // https://stackoverflow.com/a/10324802

interface LinkRegistrationFormProps {
  handleSearch: (doiUrl: string) => Promise<void>;
}

export const LinkRegistrationForm = ({ handleSearch }: LinkRegistrationFormProps) => {
  const { t } = useTranslation();

  const onSubmit = async (values: DoiFormValues, { setValues }: FormikHelpers<DoiFormValues>) => {
    let doiUrl = values.link.trim().toLowerCase();
    if (!isValidUrl(doiUrl)) {
      const regexMatch = doiRegExp.exec(doiUrl);
      if (regexMatch && regexMatch.length > 0) {
        doiUrl = `${doiUrlBase}${regexMatch[0]}`;
      }
    }
    setValues({ link: doiUrl });
    await handleSearch(doiUrl);
  };

  return (
    <Formik onSubmit={onSubmit} initialValues={emptyDoiFormValues} validationSchema={doiValidationSchema}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Field name={LinkRegistrationFormFieldName.Link}>
              {({ field, meta: { error, touched } }: FieldProps<string>) => (
                <TextField
                  sx={{ mr: '1rem' }}
                  id={field.name}
                  data-testid="new-registration-link-field"
                  variant="filled"
                  label={t('registration.registration.link_to_resource')}
                  required
                  fullWidth
                  disabled={isSubmitting}
                  {...field}
                  error={!!error && touched}
                  InputLabelProps={{ shrink: true }}
                  placeholder={doiUrlPlaceholder}
                />
              )}
            </Field>
            <LoadingButton
              data-testid="doi-search-button"
              variant="contained"
              loading={isSubmitting}
              type="submit"
              endIcon={<SearchIcon />}
              loadingPosition="end">
              {t('common.search')}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
