import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useFetchFundingSources } from '../../../api/hooks/useFetchFundingSources';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSource } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { fundingSourceAutocompleteFilterOptions, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FundingSourceFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fundingSourceParam = searchParams.get(ResultParam.FundingSource);

  const fundingSourcesQuery = useFetchFundingSources();
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  const handleChange = (selectedValue: FundingSource | null) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (selectedValue) {
      syncedParams.set(ResultParam.FundingSource, selectedValue.identifier);
    } else {
      syncedParams.delete(ResultParam.FundingSource);
    }
    syncedParams.delete(ResultParam.From);

    navigate({ search: syncedParams.toString() });
  };

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: '15rem' }}
      disabled={!fundingSourcesQuery.data}
      value={fundingSourcesList.find((source) => source.identifier === fundingSourceParam) ?? null}
      onChange={(_, newValue) => {
        handleChange(newValue);
      }}
      options={fundingSourcesList}
      filterOptions={fundingSourceAutocompleteFilterOptions}
      getOptionLabel={(option) => getLanguageString(option.name)}
      renderOption={({ key, ...props }, option) => (
        <li {...props} key={option.identifier}>
          {getLanguageString(option.name)}
        </li>
      )}
      data-testid={dataTestId.startPage.advancedSearch.fundingSourceField}
      renderInput={(params) => (
        <AutocompleteTextField
          isLoading={fundingSourcesQuery.isPending}
          {...params}
          variant="outlined"
          placeholder={t('select_funder')}
          multiline
        />
      )}
    />
  );
};
