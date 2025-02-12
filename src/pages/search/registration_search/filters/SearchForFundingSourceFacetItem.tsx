import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchFundingSources } from '../../../../api/hooks/useFetchFundingSources';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SearchForFundingSourceFacetItemProps {
  onSelectFunder: (identifier: string) => void;
}

export const SearchForFundingSourceFacetItem = ({ onSelectFunder }: SearchForFundingSourceFacetItemProps) => {
  const { t } = useTranslation();
  const fundingSourcesQuery = useFetchFundingSources();
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
      options={fundingSourcesList}
      filterOptions={(options, state) => {
        const filter = state.inputValue.toLocaleLowerCase();
        return options.filter((option) => {
          const names = Object.values(option.name).map((name) => name.toLocaleLowerCase());
          const identifier = option.identifier.toLocaleLowerCase();
          return identifier.includes(filter) || names.some((name) => name.includes(filter));
        });
      }}
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
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          data-testid={dataTestId.aggregations.fundingSourceFacetsSearchField}
          variant="outlined"
          aria-label={t('search.search_for_funder')}
          placeholder={t('search.search_for_funder')}
          showSearchIcon
        />
      )}
    />
  );
};
