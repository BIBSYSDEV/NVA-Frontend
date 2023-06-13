import { Box, List, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchTextField } from '../SearchTextField';
import { PersonListItem } from './PersonListItem';
import { searchForPerson } from '../../../api/cristinApi';

export const PersonSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const personSearchQueryParams = new URLSearchParams(location.search);
  personSearchQueryParams.delete(SearchParam.Type);

  if (!personSearchQueryParams.get(SearchParam.Name)) {
    personSearchQueryParams.set(SearchParam.Name, '.');
  }
  if (!personSearchQueryParams.get(SearchParam.Results)) {
    personSearchQueryParams.set(SearchParam.Results, '10');
  }
  if (!personSearchQueryParams.get(SearchParam.Page)) {
    personSearchQueryParams.set(SearchParam.Page, '1');
  }

  const rowsPerPage = Number(personSearchQueryParams.get(SearchParam.Results));
  const page = Number(personSearchQueryParams.get(SearchParam.Page));
  const name = personSearchQueryParams.get(SearchParam.Name) ?? '';

  const personQuery = useQuery({
    queryKey: ['person', rowsPerPage, page, name],
    queryFn: () => searchForPerson(rowsPerPage, page, name),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const searchResults = personQuery.data?.hits ?? [];

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

      {personQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.length > 0 ? (
        <>
          <List>
            {searchResults.map((person) => (
              <PersonListItem key={person.id} person={person} />
            ))}
          </List>
          <CristinSearchPagination totalCount={personQuery.data?.size ?? 0} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
