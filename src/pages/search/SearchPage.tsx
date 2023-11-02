import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, MenuItem, TextField } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchResponse } from '../../types/common.types';
import { Registration, RegistrationAggregations } from '../../types/registration.types';
import { SearchConfig, SearchParam, emptySearchConfig } from '../../utils/searchHelpers';
import { SearchTextField } from './SearchTextField';
import { PersonSearch } from './person_search/PersonSearch';
import { ProjectSearch } from './project_search/ProjectSearch';
import { RegistrationSearch } from './registration_search/RegistrationSearch';
import { RegistrationSearchBar } from './registration_search/RegistrationSearchBar';

/*
 * The Search Page allows for users to search for 3 things (types): Registrations/Results, Persons, and Projects
 * The actual flow may not be 100% obvious, but the process is simply speaking along these lines:
 *   1) Search inputs (query and filters) are added to Formik
 *   2) User submits the form
 *   3) The form's submit function builds the search query string to add to the URL based on the form values
 *   4) When the URL Search params are updated, a new search will be performed
 */

enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

interface SearchPageProps {
  searchResults: SearchResponse<Registration, RegistrationAggregations> | undefined;
  isLoadingSearch: boolean;
}

const SearchPage = ({ searchResults, isLoadingSearch }: SearchPageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);
  const { setValues } = useFormikContext<SearchConfig>();

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <Box sx={{ mb: { xs: '0.5rem', md: 0 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { sm: '1fr', md: 'auto 1fr' },
          gap: '1rem 0.5rem',
          mx: { xs: '1rem', md: 0 },
        }}>
        <TextField
          select
          value={!paramsSearchType ? SearchTypeValue.Result : paramsSearchType}
          sx={{
            mb: !resultIsSelected ? '1rem' : 0,
            minWidth: '10rem',
            '.MuiSelect-select': {
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              bgcolor: personIsSeleced || projectIsSelected ? `${paramsSearchType}.main` : 'registration.main',
            },
          }}
          inputProps={{ 'aria-label': t('common.type') }}>
          <MenuItem
            sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            value={SearchTypeValue.Result}
            onClick={() => {
              if (!resultIsSelected) {
                const resultParams = new URLSearchParams();
                history.push({ search: resultParams.toString() });
                setValues(emptySearchConfig);
              }
            }}>
            <NotesIcon fontSize="small" />
            {t('search.result')}
          </MenuItem>
          <MenuItem
            sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            value={SearchTypeValue.Person}
            onClick={() => {
              if (!personIsSeleced) {
                const personParams = new URLSearchParams();
                personParams.set(SearchParam.Type, SearchTypeValue.Person);
                history.push({ search: personParams.toString() });
                setValues(emptySearchConfig);
              }
            }}>
            <PersonIcon fontSize="small" />
            {t('search.persons')}
          </MenuItem>
          <MenuItem
            sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            value={SearchTypeValue.Project}
            onClick={() => {
              if (!projectIsSelected) {
                const projectParams = new URLSearchParams();
                projectParams.set(SearchParam.Type, SearchTypeValue.Project);
                history.push({ search: projectParams.toString() });
                setValues(emptySearchConfig);
              }
            }}>
            <ShowChartIcon fontSize="small" />
            {t('project.project')}
          </MenuItem>
        </TextField>

        {resultIsSelected && <RegistrationSearchBar aggregations={searchResults?.aggregations} />}
        {(personIsSeleced || projectIsSelected) && (
          <Field name="searchTerm">
            {({ field, form: { submitForm } }: FieldProps<string>) => (
              <SearchTextField
                {...field}
                placeholder={
                  personIsSeleced ? t('search.person_search_placeholder') : t('search.project_search_placeholder')
                }
                clearValue={() => {
                  field.onChange({ target: { value: '', id: field.name } });
                  submitForm();
                }}
              />
            )}
          </Field>
        )}
      </Box>

      {resultIsSelected && <RegistrationSearch searchResults={searchResults} isLoadingSearch={isLoadingSearch} />}
      {personIsSeleced && <PersonSearch />}
      {projectIsSelected && <ProjectSearch />}
    </Box>
  );
};

export default SearchPage;
