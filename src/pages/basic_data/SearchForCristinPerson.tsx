import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Autocomplete, AutocompleteProps, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../api/apiPaths';
import { searchByNationalIdNumber } from '../../api/cristinApi';
import { AutocompleteTextField } from '../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../components/EmphasizeSubstring';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../types/common.types';
import { CristinPerson, FlatCristinPerson } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';
import { convertToFlatCristinPerson, getMaskedNationalIdentityNumber } from '../../utils/user-helpers';
import { AddEmployeeData } from './institution_admin/AddEmployeePage';

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
  const { t } = useTranslation();
  const { resetForm } = useFormikContext<AddEmployeeData>();

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

  const selectedPersonInactiveAffiliations =
    selectedPerson?.affiliations.filter((affiliation) => !affiliation.active) ?? [];

  const selectedPersonActiveAffiliations =
    selectedPerson?.affiliations.filter((affiliation) => affiliation.active) ?? [];

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
          renderOption={({ key, ...props }, option) => (
            <li {...props} key={option.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid={`person-option-${option.id}`}>
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
              label={t('basic_data.add_employee.search_for_person')}
              showSearchIcon
              isLoading={isLoadingSearchByName}
              placeholder={t('basic_data.add_employee.name_or_nin')}
              data-testid={dataTestId.basicData.personAdmin.personSearchField}
            />
          )}
        />
      ) : isLoadingSearchByNin ? (
        <CircularProgress aria-label={t('basic_data.add_employee.search_for_person')} />
      ) : selectedPerson?.id ? (
        <>
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('common.first_name')}
            value={selectedPerson.firstName}
          />
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('common.last_name')}
            value={selectedPerson.lastName}
          />
          <TextField
            disabled
            required
            fullWidth
            variant="filled"
            label={t('common.national_id_number')}
            value={getMaskedNationalIdentityNumber(selectedPerson.nationalId)}
          />
          <div>
            {selectedPersonActiveAffiliations.length > 0 && (
              <>
                <Typography variant="h3">{t('basic_data.person_register.current_employments')}</Typography>
                <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                  {selectedPersonActiveAffiliations.map((affiliation) => {
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
              </>
            )}
            {selectedPersonInactiveAffiliations.length > 0 && (
              <>
                <Typography variant="h3">{t('basic_data.person_register.previous_employments')}</Typography>
                <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                  {selectedPersonInactiveAffiliations.map((affiliation) => {
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
              </>
            )}
          </div>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedPerson(undefined);
              resetForm();
            }}
            sx={{ width: 'fit-content' }}
            startIcon={<PersonSearchIcon />}>
            {t('basic_data.add_employee.new_search')}
          </Button>
        </>
      ) : null}
    </Box>
  );
};
