import { Registration } from '../../../types/registration.types';
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  DialogActions,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../../../api/searchApi';
import { useQuery } from '@tanstack/react-query';
import { PageSpinner } from '../../../components/PageSpinner';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../../utils/hooks/useDebounce';

interface DeleteForm {
  deleteMessage: string;
  duplicateOfUri: string;
  searchDuplicate: string;
}

interface DeletePublicationProps {
  registration: Registration;
  refetchData: () => void;
}

const deleteValidationSchema = Yup.object().shape({
  deleteMessage: Yup.string().min(3, 'Begrunnelsen må minst være på 3 tegn').required('Begrunnelse er påkrevt'),
  duplicateOfUri: Yup.string().url(),
  searchDuplicate: Yup.string(),
});

function isTitle(query: string) {
  return !isDoi(query) && !isHandle(query);
}

function isDoi(query: string) {
  return query.includes('https://doi.org/');
}

function isHandle(query: string) {
  return query.includes('https://hdl.handle.net/');
}

export const DeletePublication = ({ registration, refetchData }: DeletePublicationProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const [searchBeforeDebounce, setSearchBeforeDebounce] = useState('');
  const debouncedSearch = useDebounce(searchBeforeDebounce);
  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration | null>(null);

  const fetchQuery = {
    title: isTitle(debouncedSearch) ? debouncedSearch : null,
    doi: isDoi(debouncedSearch) ? debouncedSearch : null,
    query: isHandle(debouncedSearch) ? debouncedSearch : null,
  };

  const duplicateRegistrationSearch = useQuery({
    enabled: debouncedSearch.length > 0,
    queryKey: ['duplicateRegistration', fetchQuery],
    queryFn: () => fetchResults(fetchQuery),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });
  const handleDelete = (values: DeleteForm) => {
    console.log('submitting');
    //contact api
    setShowDeleteModal(false);
  };

  const searchResults = duplicateRegistrationSearch.data?.hits ?? [];
  const searchResultNotContainingToBeDeleted = searchResults.filter(
    (possibleDuplicate) => possibleDuplicate.identifier !== registration.identifier
  );

  const handleSearchAutoCompleteChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchBeforeDebounce(event.target.value);
  };

  const defaultProps = {
    options: searchResultNotContainingToBeDeleted,
    getOptionLabel: (option: Registration | string) => {
      if (typeof option === 'string') {
        return option;
      }
      return option.entityDescription?.mainTitle ?? '';
    },
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
        <Divider />
        <Breadcrumbs
          sx={{ alignSelf: 'center' }}
          itemsBeforeCollapse={0}
          itemsAfterCollapse={0}
          maxItems={0}
          aria-label={'vis flere valg'}>
          <Button data-testid={'open delete modal'} variant="outlined" onClick={() => setShowDeleteModal(true)}>
            Slette
          </Button>
        </Breadcrumbs>
      </Box>
      <Modal
        dataTestId={'delete modal'}
        headingText={'Slette resultat'}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Box>
            <Typography variant="caption">* Felt med stjerne er obligatorisk</Typography>
          </Box>
          <Box sx={{ gap: '1rem' }}>
            <Typography variant="h3">Avpubliser forskningsresultat</Typography>
            <Typography>
              Ved avpublisering vil ikke forskningsresultatet være søkbare i NVA, men vil fortsatt være tilgjengelige
              ved oppslag av referanse.
            </Typography>
            <Typography>
              Eventuelle filer vil fjernes fra forskningsresultatet av avpublisering, men blir ikke permanent slettet.
            </Typography>
          </Box>

          <Formik
            initialValues={{
              deleteMessage: '',
              duplicateOfUri: '',
              searchDuplicate: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={(values, formikHelpers) => {
              handleDelete(values);
            }}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Box>
                  <Typography variant="h3">Er dette en feilregistrering?</Typography>
                  <Typography gutterBottom={true}>
                    Legg inn en kort begrunnelse for at dette forskningsresultatet ikke lenger skal være publisert.
                    Begrunnelsen vil vises på forskningsresultatet ved oppslag av referanse til forskningsresultet.
                  </Typography>
                  <TextField
                    variant="filled"
                    fullWidth
                    id="deleteMessageId"
                    name="deleteMessage"
                    label={'Begrunnelse'}
                    placeholder={'skriv inn'}
                    required={true}
                    value={values.deleteMessage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.deleteMessage && Boolean(errors.deleteMessage)}
                    helperText={touched.deleteMessage && errors.deleteMessage}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Box>
                    <Typography variant="h3">
                      Finnes det en annen publisert versjon av samme forskningsresultat?
                    </Typography>
                    <Typography>
                      For at alle siteringer skal bli videreført, må du søke opp den andre registreringen. Da vil alle
                      siteringer fortsatt føre til den andre versjonen
                    </Typography>
                  </Box>
                  <Typography variant="h3">Søk etter registrert resultat</Typography>
                </Box>
                <Autocomplete
                  {...defaultProps}
                  freeSolo
                  id="gurba gusdfasd"
                  loading={duplicateRegistrationSearch.isLoading && !!debouncedSearch}
                  value={selectedDuplicate}
                  onChange={(_event, newValue, _reason) => {
                    if (typeof newValue === 'string') {
                      setSelectedDuplicate(null);
                    } else {
                      setSelectedDuplicate(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={'Søk med DOI, handle eller tittel'}
                      variant="filled"
                      onChange={(event) => handleSearchAutoCompleteChange(event)}
                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        startAdornment: (
                          <IconButton
                            type="submit"
                            data-testid={dataTestId.startPage.searchButton}
                            title={t('common.search')}
                            size="large">
                            <SearchIcon />
                          </IconButton>
                        ),
                        endAdornment: (
                          <>
                            {duplicateRegistrationSearch.isLoading && !!debouncedSearch ? (
                              <PageSpinner color="inherit" size={'1rem'} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Box aria-live="polite" aria-busy={duplicateRegistrationSearch.isLoading}>
                  {duplicateRegistrationSearch.isLoading ? (
                    <PageSpinner aria-label="Resultat" />
                  ) : (
                    <>
                      {!!selectedDuplicate && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
                          <Typography>Resultat</Typography>
                          <ErrorBoundary key={selectedDuplicate.id}>
                            <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
                              <RegistrationListItemContent target="_blank" registration={selectedDuplicate} />
                            </SearchListItem>
                          </ErrorBoundary>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
                <DialogActions>
                  <Button data-testid={'close delete modal'} onClick={() => setShowDeleteModal(false)}>
                    Angre
                  </Button>
                  <Button type="submit" data-testid={'delete-registration-button'} variant="outlined">
                    Lagre
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
