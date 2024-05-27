import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import {
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { RegistrationList } from '../../../components/RegistrationList';
import { dataTestId } from '../../../utils/dataTestIds';
import { doiUrlBase, makeDoiUrl } from '../../../utils/general-helpers';
import { RegistrationAccordion } from './RegistrationAccordion';
import { useGetRegistrationsWithDoi } from '../../../api/hooks/useGetRegistrationsWithDoi';
import { useGetDoiPreview } from '../../../api/hooks/useGetDoiPreview';
import { useCreateRegistrationFromDoi } from '../../../api/hooks/useCreateRegistrationFromDoi';
import { AxiosResponse } from 'axios';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { Registration } from '../../../types/registration.types';

export interface StartRegistrationAccordionProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

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

const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;

export const LinkRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [doiQuery, setDoiQuery] = useState('');

  const onCreateRegistrationSuccess = (response: AxiosResponse<Registration, any>) => {
    history.push(getRegistrationWizardPath(response.data.identifier), { highestValidatedTab: -1 });
  };

  const doiSearchResults = useGetRegistrationsWithDoi(doiQuery);
  const doiPreview = useGetDoiPreview();
  const createRegistrationFromDoi = useCreateRegistrationFromDoi(onCreateRegistrationSuccess);

  const registrationsWithDoi = doiSearchResults.data?.hits ?? [];
  const isLookingUpDoi = doiSearchResults.isFetching || doiPreview.isPending;
  const isCreatingRegistration = createRegistrationFromDoi.isPending;

  useEffect(() => {
    if (doiSearchResults.isSuccess && doiSearchResults.data.hits.length === 0) {
      doiPreview.mutate(doiQuery);
    }
  }, [doiSearchResults.isSuccess, doiSearchResults.data, doiQuery, doiPreview]);

  const onSearchDoi = (values: DoiFormValues, { setValues }: FormikHelpers<DoiFormValues>) => {
    const doiUrl = makeDoiUrl(values.link);

    setDoiQuery(doiUrl);
    setValues({ link: doiUrl });
  };

  const persistRegistration = () => {
    if (!doiPreview.data) {
      return;
    }
    createRegistrationFromDoi.mutate(doiPreview.data);
  };

  return (
    <RegistrationAccordion elevation={5} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.linkAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <LinkIcon />
        <div>
          <Typography variant="h2">{t('registration.registration.start_with_link_to_resource_title')}</Typography>
          <Typography>{t('registration.registration.start_with_link_to_resource_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <Formik onSubmit={onSearchDoi} initialValues={emptyDoiFormValues} validationSchema={doiValidationSchema}>
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
                  loading={isLookingUpDoi}
                  type="submit"
                  endIcon={<SearchIcon />}
                  loadingPosition="end">
                  {t('common.search')}
                </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
        {doiSearchResults.isFetched && registrationsWithDoi.length === 0 && doiPreview.isError && (
          <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>
        )}
        {registrationsWithDoi.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
            <Divider />
            <Typography
              sx={{
                bgcolor: 'primary.light',
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
        {registrationsWithDoi.length === 0 && doiPreview.isSuccess && (
          <div data-testid={dataTestId.registrationWizard.new.linkMetadata}>
            <Typography sx={{ mt: '1rem' }} variant="h3" gutterBottom>
              {t('common.result')}:
            </Typography>
            <Typography>{doiPreview.data.entityDescription.mainTitle}</Typography>
          </div>
        )}
      </AccordionDetails>

      <AccordionActions>
        <LoadingButton
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          variant="contained"
          disabled={isLookingUpDoi || registrationsWithDoi.length > 0 || doiPreview.isError || !doiQuery}
          loading={isCreatingRegistration}
          onClick={persistRegistration}>
          {t('registration.registration.start_registration')}
        </LoadingButton>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
