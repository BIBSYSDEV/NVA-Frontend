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
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { getRegistrationByDoi } from '../../../api/registrationApi';
import { fetchResults } from '../../../api/searchApi';
import { RegistrationList } from '../../../components/RegistrationList';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';
import { isValidUrl } from '../../../utils/general-helpers';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { RegistrationAccordion } from './RegistrationAccordion';

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

const doiUrlBase = 'https://doi.org/';
const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;
const doiRegExp = new RegExp('\\b(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'<>])\\S)+)\\b'); // https://stackoverflow.com/a/10324802

export const LinkRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t } = useTranslation();
  const [doiQuery, setDoiQuery] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const openRegistration = async () => {
    if (!mutateDoi.data) {
      return;
    }
    history.push(getRegistrationWizardPath(mutateDoi.data.identifier), { highestValidatedTab: -1 });
  };

  const resultsQuery = useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: () => fetchResults({ doi: doiQuery }),
  });

  const searchResults = resultsQuery.data?.hits ?? [];

  const mutateDoi = useMutation({
    mutationFn: (doi: string) => getRegistrationByDoi(doi),
    onSuccess: (response) => {
      if (stringIncludesMathJax(response.title)) {
        typesetMathJax();
      }
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.get_doi'), variant: 'error' }));
    },
  });

  const mutateDoiRef = useRef(mutateDoi);
  useEffect(() => {
    if (resultsQuery.isSuccess && resultsQuery.data.hits.length === 0) {
      mutateDoiRef.current.mutate(doiQuery);
    }
  }, [resultsQuery.isSuccess, resultsQuery.data, doiQuery]);

  const isLookingUpDoi = resultsQuery.isFetching || mutateDoi.isPending;

  const onSubmit = async (values: DoiFormValues, { setValues }: FormikHelpers<DoiFormValues>) => {
    let doiUrl = values.link.trim();

    if (!isValidUrl(doiUrl)) {
      const regexMatch = doiRegExp.exec(doiUrl);
      if (regexMatch && regexMatch.length > 0) {
        doiUrl = `${doiUrlBase}${regexMatch[0]}`;
      }
    }
    setDoiQuery(doiUrl);
    setValues({ link: doiUrl });
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
        {resultsQuery.isFetched && searchResults.length === 0 && mutateDoi.isError && (
          <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>
        )}
        {searchResults.length > 0 && (
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
            <RegistrationList registrations={searchResults} />
            <Divider />
          </Box>
        )}
        {searchResults.length === 0 && mutateDoi.isSuccess && (
          <div data-testid={dataTestId.registrationWizard.new.linkMetadata}>
            <Typography sx={{ mt: '1rem' }} variant="h3" gutterBottom>
              {t('common.result')}:
            </Typography>
            <Typography>{mutateDoi.data.title}</Typography>
          </div>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          variant="contained"
          disabled={isLookingUpDoi || searchResults.length > 0 || mutateDoi.isError || !doiQuery}
          onClick={openRegistration}>
          {t('registration.registration.start_registration')}
        </Button>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
