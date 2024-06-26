import { Autocomplete, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { fetchJournal, searchForJournals } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Journal } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';

export const JournalFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const journalParam = searchParams.get(ResultParam.Journal);
  const [journalQuery, setJournalQuery] = useState('');
  const debouncedQuery = useDebounce(journalQuery);

  const journalOptionsQuery = useQuery({
    queryKey: ['journalSearch', debouncedQuery],
    enabled: debouncedQuery.length > 3 && debouncedQuery === journalQuery,
    queryFn: () => searchForJournals(debouncedQuery, '2023'),
    meta: { errorMessage: t('feedback.error.get_journals') },
  });

  const journalList = journalOptionsQuery.data?.hits ?? [];

  const selectedJournalQuery = useQuery({
    enabled: !!journalParam,
    queryKey: [journalParam],
    queryFn: () => (journalParam ? fetchJournal(journalParam) : undefined),
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });

  const handleChange = (selectedValue: Journal | null) => {
    if (selectedValue) {
      searchParams.set(ResultParam.Journal, selectedValue.identifier);
    } else {
      searchParams.delete(ResultParam.Journal);
    }

    history.push({ search: searchParams.toString() });
  };

  const isFetching = journalParam ? selectedJournalQuery.isPending : journalOptionsQuery.isFetching;

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: '15rem' }}
      value={journalParam && selectedJournalQuery.data ? selectedJournalQuery.data : null}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={debouncedQuery && journalQuery === debouncedQuery && !journalOptionsQuery.isPending ? journalList : []}
      filterOptions={(options) => options}
      inputValue={journalQuery}
      onInputChange={(_, newInputValue) => setJournalQuery(newInputValue)}
      onChange={(_, newValue) => handleChange(newValue)}
      blurOnSelect
      disableClearable={!journalQuery}
      loading={isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Typography>{option.name}</Typography>
        </li>
      )}
      data-testid={dataTestId.startPage.advancedSearch.journalField}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={isFetching}
          placeholder={t('registration.resource_type.search_for_title_or_issn')}
          showSearchIcon={!journalParam}
          multiline
        />
      )}
    />
  );
};
