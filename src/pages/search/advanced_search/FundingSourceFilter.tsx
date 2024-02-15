import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchFundingSources } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSource } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FundingSourceFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchTerm = searchParams.get(ResultParam.FundingSource);

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    meta: { errorMessage: t('feedback.error.get_funding_sources') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  const handleChange = (selectedValue: FundingSource | null) => {
    if (selectedValue) {
      searchParams.set(ResultParam.FundingSource, selectedValue.identifier);
    } else {
      searchParams.delete(ResultParam.FundingSource);
    }

    history.push({ search: searchParams.toString() });
  };

  return (
    <Autocomplete
      sx={{ minWidth: '15rem' }}
      disabled={!fundingSourcesQuery.data}
      value={fundingSourcesList.find((source) => source.identifier === currentSearchTerm)}
      onChange={(_, newValue) => {
        handleChange(newValue);
      }}
      options={fundingSourcesList}
      getOptionLabel={(option) => getLanguageString(option.name)}
      renderOption={(props, option) => (
        <li {...props} key={option.identifier}>
          {getLanguageString(option.name)}
        </li>
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          isLoading={fundingSourcesQuery.isLoading}
          {...params}
          variant="outlined"
          placeholder={t('search.search_for_funder')}
          showSearchIcon={!currentSearchTerm}
          multiline
        />
      )}
    />
  );
};
