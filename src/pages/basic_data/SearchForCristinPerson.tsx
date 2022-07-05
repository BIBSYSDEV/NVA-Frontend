import { Autocomplete, AutocompleteProps, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CristinApiPath } from '../../api/apiPaths';
import { searchByNationalIdNumber } from '../../api/userApi';
import { AutocompleteTextField } from '../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../components/EmphasizeSubstring';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../types/common.types';
import { CristinPerson, FlatCristinPerson } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { convertToFlatCristinPerson, getMaskedNationalIdentityNumber } from '../../utils/user-helpers';

interface SearchForCristinPersonProps
  extends Pick<AutocompleteProps<FlatCristinPerson, false, false, false>, 'disabled'> {
  selectedPerson: FlatCristinPerson | undefined;
  setSelectedPerson: (person: FlatCristinPerson | undefined) => void;
}

export const SearchForCristinPerson = ({
  selectedPerson,
  setSelectedPerson,
  disabled,
}: SearchForCristinPersonProps) => {
  const { t } = useTranslation('basicData');

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);
  const searchQueryIsNumber = !!searchQuery && !isNaN(Number(searchQuery));

  const [isLoadingSearchByNin, setIsLoadingSearchByNin] = useState(false);

  const [searchByNameResponse, isLoadingSearchByName] = useFetch<SearchResponse<CristinPerson>>({
    url:
      searchQuery && searchQuery === debouncedSearchQuery && !searchQueryIsNumber
        ? `${CristinApiPath.Person}?results=20&name=${debouncedSearchQuery}`
        : '',
    withAuthentication: true,
  });
  const searchByNameOptions = searchByNameResponse?.hits
    ? searchByNameResponse.hits.map((person) => convertToFlatCristinPerson(person))
    : [];

  useEffect(() => {
    const searchQueryIsNin = searchQueryIsNumber && searchQuery.length === 11;

    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (searchQueryIsNin) {
      const searchByNationalId = async () => {
        setIsLoadingSearchByNin(true);
        const searchResponse = await searchByNationalIdNumber(searchQuery);
        if (isSuccessStatus(searchResponse.status)) {
          const foundPerson = convertToFlatCristinPerson(searchResponse.data);
          setSelectedPerson(foundPerson);
        }
        setIsLoadingSearchByNin(false);
      };

      searchByNationalId();
    }
  }, [setSelectedPerson, searchQueryIsNumber, searchQuery]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {!selectedPerson?.id ? (
        <Autocomplete
          disabled={disabled}
          options={searchByNameOptions}
          getOptionLabel={() => searchQuery}
          inputValue={searchQuery}
          onChange={(_, value) => {
            if (value) {
              setSelectedPerson(value);
            }
          }}
          onInputChange={(_, value) => setSearchQuery(value)}
          loading={isLoadingSearchByNin || isLoadingSearchByName}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid={`project-option-${option.id}`}>
                <Typography variant="subtitle1">
                  <EmphasizeSubstring text={`${option.firstName} ${option.lastName}`} emphasized={searchQuery} />
                </Typography>
                <Typography>{getMaskedNationalIdentityNumber(option.nationalId)}</Typography>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              value={searchQuery}
              label={t('add_employee.search_for_person')}
              showSearchIcon
              isLoading={isLoadingSearchByName}
              placeholder={t('add_employee.name_or_nin')}
            />
          )}
        />
      ) : isLoadingSearchByNin ? (
        <CircularProgress />
      ) : selectedPerson?.id ? (
        <>
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('common:first_name')}
            value={selectedPerson.firstName}
          />
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('common:last_name')}
            value={selectedPerson.lastName}
          />
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('national_id')}
            value={getMaskedNationalIdentityNumber(selectedPerson.nationalId)}
          />
          <div>
            <Typography variant="overline">{t('common:employments')}</Typography>
            <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
              {selectedPerson.affiliations.map((affiliation) => {
                const roleString = getLanguageString(affiliation.role.labels);
                return (
                  <li key={affiliation.organization}>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                      {roleString && <Typography>{roleString}:</Typography>}
                      <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                    </Box>
                  </li>
                );
              })}
            </Box>
          </div>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setSelectedPerson(undefined)}
            sx={{ width: 'fit-content' }}
            startIcon={<HighlightOffIcon />}>
            {t('add_employee.remove_selected_person')}
          </Button>
        </>
      ) : null}
    </Box>
  );
};
