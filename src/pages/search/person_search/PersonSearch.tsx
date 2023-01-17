import { Box, List, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchTextField } from '../SearchTextField';
import { PersonListItem } from './PersonListItem';

export const PersonSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const personSearchQueryParmas = new URLSearchParams(location.search);
  personSearchQueryParmas.delete(SearchParam.Type);
  const queryParams = personSearchQueryParmas.toString();

  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<CristinPerson>>({
    url: queryParams ? `${CristinApiPath.Person}?${queryParams}` : '',
    errorMessage: t('feedback.error.search'),
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field name="searchTerm">
        {({ field, form: { submitForm } }: FieldProps<string>) => (
          <SearchTextField
            {...field}
            placeholder={t('search.person_search_placeholder')}
            clearValue={() => {
              field.onChange({ target: { value: '', id: field.name } });
              submitForm();
            }}
          />
        )}
      </Field>

      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.hits.length > 0 ? (
        <>
          <List>
            {searchResults.hits.map((person) => (
              <PersonListItem key={person.id} person={person} />
            ))}
          </List>
          <CristinSearchPagination totalCount={searchResults.size} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
