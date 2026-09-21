import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useCreateRegistrationFromDoi } from '../../../api/hooks/useCreateRegistrationFromDoi';
import { useLookupDoi } from '../../../api/hooks/useLookupDoi';
import { RegistrationList } from '../../../components/RegistrationList';
import { RegistrationFormLocationState } from '../../../types/locationState.types';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import i18n from '../../../translations/i18n';
import { doiUrlBase, isValidResourceLink } from '../../../utils/general-helpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { RegistrationAccordion } from './RegistrationAccordion';

export interface StartRegistrationAccordionProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

enum LinkRegistrationFormFieldName {
  Link = 'link',
}

const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;

const linkErrorMessage = {
  required: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.registration.link_to_resource'),
  }),
  invalidFormat: i18n.t('feedback.validation.has_invalid_format_example', {
    field: i18n.t('registration.registration.link_to_resource'),
    example: doiUrlPlaceholder,
    interpolation: { escapeValue: false }, // The example is a URL, and its slashes must not be HTML escaped
  }),
};

const doiValidationSchema = Yup.object({
  [LinkRegistrationFormFieldName.Link]: Yup.string()
    .trim()
    .required(linkErrorMessage.required)
    .test('is-valid-resource-link', linkErrorMessage.invalidFormat, (value) => !value || isValidResourceLink(value)),
});

interface DoiFormValues {
  [LinkRegistrationFormFieldName.Link]: string;
}

const emptyDoiFormValues: DoiFormValues = {
  [LinkRegistrationFormFieldName.Link]: '',
};

export const LinkRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [doiQuery, setDoiQuery] = useState('');

  const onCreateRegistrationSuccess = (response: AxiosResponse<Registration, any>) => {
    navigate(getRegistrationWizardPath(response.data.identifier), {
      state: { skipInitialValidation: true } satisfies RegistrationFormLocationState,
    });
  };

  const { registrationsWithDoi, isLookingUpDoi, noHits, doiPreview, resetLookup } = useLookupDoi(doiQuery);
  const createRegistrationFromDoi = useCreateRegistrationFromDoi(onCreateRegistrationSuccess);

  const clearLookupResults = () => {
    setDoiQuery('');
    resetLookup();
  };

  const persistRegistration = () => {
    if (!doiPreview) {
      return;
    }
    createRegistrationFromDoi.mutate(doiPreview);
  };

  return (
    <RegistrationAccordion elevation={5} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.linkAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <LinkIcon />
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h2" component="span">
            {t('registration.registration.start_with_link_to_resource_title')}
          </Typography>
          <Typography component="span">
            {t('registration.registration.start_with_link_to_resource_description')}
          </Typography>
        </span>
      </AccordionSummary>

      <AccordionDetails>
        <Formik
          onSubmit={async (values) => setDoiQuery(values.link.trim())}
          initialValues={emptyDoiFormValues}
          validationSchema={doiValidationSchema}>
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
                      onChange={(event) => {
                        field.onChange(event);
                        clearLookupResults();
                      }}
                      error={touched && !!error}
                      helperText={touched && error ? error : ''}
                      placeholder={doiUrlPlaceholder}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                </Field>
                <Button
                  data-testid="doi-search-button"
                  color="secondary"
                  variant="contained"
                  loading={isLookingUpDoi}
                  type="submit"
                  endIcon={<SearchIcon />}
                  loadingPosition="end">
                  {t('common.search')}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        {noHits && <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>}
        {registrationsWithDoi.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <Divider />
            <Typography
              sx={{
                bgcolor: 'info.main',
                color: 'primary.contrastText',
                width: 'fit-content',
                p: '0.5rem',
                borderRadius: '4px',
              }}>
              {t('registration.registration.registration_doi_validation_message')}
            </Typography>
            <RegistrationList registrations={registrationsWithDoi} />
            <Divider />
          </Box>
        )}
        {registrationsWithDoi.length === 0 && doiPreview && (
          <div data-testid={dataTestId.registrationWizard.new.linkMetadata}>
            <Typography sx={{ mt: '1rem' }} variant="h3" gutterBottom>
              {t('common.result')}:
            </Typography>
            <Typography>{doiPreview.entityDescription.mainTitle}</Typography>
          </div>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          loadingPosition="end"
          variant="contained"
          color="secondary"
          disabled={isLookingUpDoi || registrationsWithDoi.length > 0 || !doiPreview || !doiQuery}
          loading={createRegistrationFromDoi.isPending}
          onClick={persistRegistration}>
          {t('registration.registration.start_registration')}
        </Button>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
