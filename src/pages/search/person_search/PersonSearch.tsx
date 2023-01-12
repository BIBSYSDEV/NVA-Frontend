import { Box, List, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { SearchParam } from '../../../utils/searchHelpers';
import { SearchTextField } from '../SearchTextField';
import { PersonListItem } from './PersonListItem';

export const PersonSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get(SearchParam.Query);
  const nameQuery = queryParam?.replaceAll('"', ''); // TODO: Remove "" from query as default, and add it if/when needed instead?

  const [searchResults, isLoadingSearch] = useFetch<SearchResponse<CristinPerson>>({
    url: nameQuery ? `${CristinApiPath.Person}?name=${nameQuery}&results=10` : '',
    errorMessage: t('feedback.error.search'),
  });

  const persons = searchResults?.hits ?? [];

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
      ) : persons.length > 0 ? (
        <List>
          {persons.map((person) => (
            <PersonListItem key={person.id} person={person} />
          ))}
        </List>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
