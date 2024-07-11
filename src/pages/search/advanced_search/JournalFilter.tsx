import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { defaultChannelSearchSize, fetchJournal, searchForJournals } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Journal } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData } from '../../../utils/searchHelpers';
import { PublicationChannelOption } from '../../registration/resource_type_tab/components/PublicationChannelOption';

export const JournalFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const journalParam = searchParams.get(ResultParam.Journal);
  const [journalQuery, setJournalQuery] = useState('');
  const debouncedQuery = useDebounce(journalQuery);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const journalOptionsQuery = useQuery({
    queryKey: ['journalSearch', debouncedQuery, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === journalQuery,
    queryFn: () => searchForJournals(debouncedQuery, '2023', searchSize),
    meta: { errorMessage: t('feedback.error.get_journals') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  const options = journalOptionsQuery.data?.hits ?? [];

  const selectedJournalQuery = useQuery({
    enabled: !!journalParam,
    queryKey: ['channel', journalParam],
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
      options={options}
      filterOptions={(options) => options}
      inputValue={journalQuery}
      onInputChange={(_, newInputValue) => setJournalQuery(newInputValue)}
      onChange={(_, newValue) => handleChange(newValue)}
      blurOnSelect
      disableClearable={!journalQuery}
      loading={isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={({ key, ...props }, option, state) => (
        <PublicationChannelOption
          key={option.identifier}
          props={props}
          option={option}
          state={state}
          hideScientificLevel
        />
      )}
      ListboxComponent={AutocompleteListboxWithExpansion}
      ListboxProps={
        {
          hasMoreHits: !!journalOptionsQuery.data?.totalHits && journalOptionsQuery.data.totalHits > searchSize,
          onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
          isLoadingMoreHits: journalOptionsQuery.isFetching && searchSize > options.length,
        } satisfies AutocompleteListboxWithExpansionProps as any
      }
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
