import { Autocomplete, Box, Button, CircularProgress, Link, Skeleton, TextField, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SearchApiPath } from '../../../../../api/apiPaths';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { SearchResponse } from '../../../../../types/common.types';
import { RegistrationFieldName, ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { isValidUrl } from '../../../../../utils/hooks/useFetchResource';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../../../utils/urlPaths';
import { PublisherField } from '../../components/PublisherField';
import { YearAndContributorsText } from '../../components/SearchContainerField';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';

export const DataManagementPlanForm = () => {
  const params = useParams<{ identifier: string }>();
  const { values } = useFormikContext<ResearchDataRegistration>();
  const relatedResourceUris = values.entityDescription?.reference?.publicationInstance.related ?? [];

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [searchOptions, isLoadingSearchOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedSearchQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedSearchQuery} AND NOT (${RegistrationFieldName.Identifier}:"${params.identifier}")`
      : '',
  });

  return (
    <>
      <PublisherField />

      <Typography variant="h2">Relaterte lenker</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={searchOptions?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !relatedResourceUris.includes(value.id)) {
                  push(value.id);
                }
                setSearchQuery('');
              }}
              blurOnSelect
              loading={isLoadingSearchOptions}
              filterOptions={(options) => options}
              getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
              renderOption={(props, option, state) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring
                        text={getTitleString(option.entityDescription?.mainTitle)}
                        emphasized={state.inputValue}
                      />
                    </Typography>
                    <YearAndContributorsText
                      date={option.entityDescription?.date}
                      contributors={option.entityDescription?.contributors ?? []}
                    />
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ maxWidth: '40rem' }}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  variant="filled"
                  label="Søk etter relaterte registreringer"
                  helperText="Velg blant registreringer som er publisert i NVA."
                />
              )}
            />
            <ExternalLinkField
              onAddClick={(url) => {
                if (!relatedResourceUris.includes(url)) {
                  push(url);
                }
              }}
            />

            <Box component="ul" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedResourceUris.map((uri, index) => (
                <RelatedResourceRow key={uri} uri={uri} removeRelatedResource={() => remove(index)} />
              ))}
            </Box>
          </>
        )}
      </FieldArray>
    </>
  );
};

interface RelatedResourceRowRowProps {
  uri: string;
  removeRelatedResource: () => void;
}

const RelatedResourceRow = ({ uri, removeRelatedResource }: RelatedResourceRowRowProps) => {
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: isInternalRegistration ? uri : '' });
  const [confirmRemoveRelation, setConfirmRemoveRelation] = useState(false);

  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : (
        <>
          {isInternalRegistration ? (
            <Link component={RouterLink} to={getRegistrationLandingPagePath(registration?.identifier ?? '')}>
              {getTitleString(registration?.entityDescription?.mainTitle)}
            </Link>
          ) : (
            <Link href={uri}>{uri}</Link>
          )}
          <Button
            size="small"
            variant="outlined"
            sx={{ ml: '1rem' }}
            color="error"
            onClick={() => setConfirmRemoveRelation(true)}
            startIcon={<RemoveCircleOutlineIcon />}>
            Fjern relasjon
          </Button>
        </>
      )}
      <ConfirmDialog
        open={confirmRemoveRelation}
        title={'Fjerne relasjopn?'}
        onAccept={removeRelatedResource}
        onCancel={() => setConfirmRemoveRelation(false)}>
        <Typography>Ønsker du å fjerne denne relasjonen?</Typography>
      </ConfirmDialog>
    </Box>
  );
};

interface ExternalLinkFieldProps {
  onAddClick: (url: string) => void;
}

const ExternalLinkField = ({ onAddClick }: ExternalLinkFieldProps) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);

  useEffect(() => {
    const validateUrlHeadResponse = async () => {
      setIsVerifyingLink(true);

      await fetch(inputUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(() => setIsValidLink(true))
        .catch(() => setIsValidLink(false));
      setIsVerifyingLink(false);
    };

    if (isValidUrl(inputUrl)) {
      validateUrlHeadResponse();
    } else {
      setIsValidLink(false);
    }
  }, [inputUrl]);

  const canShowErrorState = !!inputUrl && !isVerifyingLink && !isValidLink;

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <TextField
        variant="filled"
        fullWidth
        sx={{ maxWidth: '40rem' }}
        label="Eksterne lenker"
        value={inputUrl}
        onChange={(event) => setInputUrl(event.target.value)}
        helperText={
          canShowErrorState
            ? 'Ugyldig URL. Pass på at lenken du oppgir er fullstendig. Eksempel: https://sikt.no'
            : 'Oppgi ekstern URL med relatert innhold.'
        }
        error={canShowErrorState}
      />
      {inputUrl &&
        (isVerifyingLink ? (
          <CircularProgress aria-label="Validerer lenke" />
        ) : isValidLink ? (
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', mt: '0.5rem' }}
            disabled={!inputUrl || !isValidLink || isVerifyingLink}
            onClick={() => {
              onAddClick(inputUrl);
              setInputUrl('');
            }}
            startIcon={<AddIcon />}>
            Legg til lenke
          </Button>
        ) : null)}
    </Box>
  );
};
