import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchFundingSources } from '../../../api/hooks/useFetchFundingSources';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { dataTestId } from '../../../utils/dataTestIds';
import { fundingSourceAutocompleteFilterOptions } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface SearchForFundingSourceFacetItemProps {
  onSelectFunder: (identifier: string) => void;
}

export const SearchForFundingSourceFacetItem = ({ onSelectFunder }: SearchForFundingSourceFacetItemProps) => {
  const { t } = useTranslation();
  const [enableFundingSourcesQuery, setEnableFundingSourcesQuery] = useState(false);
  const fundingSourcesQuery = useFetchFundingSources({ enabled: enableFundingSourcesQuery });
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Autocomplete
      fullWidth
      size="small"
      sx={{ p: '0.25rem 0.5rem' }}
      value={null}
      inputValue={searchQuery}
      onInputChange={(_, value, reason) => {
        if (reason !== 'blur' && reason !== 'reset') {
          setSearchQuery(value);
        }
      }}
      loading={fundingSourcesQuery.isFetching}
      options={fundingSourcesList}
      filterOptions={fundingSourceAutocompleteFilterOptions}
      renderOption={({ key, ...props }, option) => (
        <li {...props} key={option.identifier}>
          {getLanguageString(option.name)}
        </li>
      )}
      getOptionLabel={(option) => getLanguageString(option.name)}
      onChange={(_, value) => {
        if (value) {
          onSelectFunder(value.identifier);
        }
        setSearchQuery('');
      }}
      onOpen={() => setEnableFundingSourcesQuery(true)}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          isLoading={fundingSourcesQuery.isFetching}
          data-testid={dataTestId.aggregations.fundingSourceFacetsSearchField}
          variant="outlined"
          placeholder={t('select_funder')}
        />
      )}
    />
  );
};
