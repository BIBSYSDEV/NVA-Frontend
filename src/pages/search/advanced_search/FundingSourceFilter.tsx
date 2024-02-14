import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchFundingSources } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { setNotification } from '../../../redux/notificationSlice';
import { FundingSource } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FundingSourceFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paramName = ResultParam.FundingSource;
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchTerm = searchParams.get(paramName) || '';

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_funding_sources'), variant: 'error' })),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  const handleChange = (selectedValue: FundingSource | null) => {
    if (selectedValue) {
      const value = selectedValue.id.split('/').pop() ?? '';
      searchParams.set(paramName, value);
    } else {
      searchParams.delete(paramName);
    }

    history.push({ search: searchParams.toString() });
  };

  return (
    <Autocomplete
      sx={{ minWidth: '15rem' }}
      disabled={!fundingSourcesQuery.data}
      value={
        currentSearchTerm
          ? fundingSourcesList.find(
              (source) => source.id === `https://api.dev.nva.aws.unit.no/cristin/funding-sources/${currentSearchTerm}`
            )
          : null
      }
      onChange={(_, newValue) => {
        handleChange(newValue);
      }}
      options={fundingSourcesList}
      getOptionLabel={(option) => getLanguageString(option.name)}
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
