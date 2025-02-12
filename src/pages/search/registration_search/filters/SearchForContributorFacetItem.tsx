import { Autocomplete, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { keepSimilarPreviousData, useSearchForPerson } from '../../../../api/hooks/useSearchForPerson';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { filterActiveAffiliations, getFullCristinName } from '../../../../utils/user-helpers';

interface SearchForInstitutionFacetItemProps {
  onSelectContributor: (identifier: string) => void;
}

const defaultPersonSearchSize = 10;

export const SearchForContributorFacetItem = ({ onSelectContributor }: SearchForInstitutionFacetItemProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSize, setSearchSize] = useState(defaultPersonSearchSize);
  const debouncedQuery = useDebounce(searchQuery);
  const personSearchQuery = useSearchForPerson({
    name: debouncedQuery,
    results: searchSize,
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  const options = personSearchQuery.data?.hits ?? [];

  return (
    <Autocomplete
      fullWidth
      size="small"
      sx={{ p: '0.25rem 0.5rem' }}
      options={options}
      inputMode="search"
      value={null}
      getOptionLabel={(option) => getFullCristinName(option.names)}
      getOptionKey={(option) => option.id}
      filterOptions={(options) => options}
      inputValue={searchQuery}
      onInputChange={(_, value, reason) => {
        if (reason !== 'blur' && reason !== 'reset') {
          setSearchQuery(value);
        }
      }}
      onChange={(_, selectedPerson) => {
        if (selectedPerson) {
          onSelectContributor(getIdentifierFromId(selectedPerson.id));
        }
        setSearchQuery('');
      }}
      loading={personSearchQuery.isFetching}
      renderOption={({ key, ...props }, option) => {
        const activeAffiliations = filterActiveAffiliations(option.affiliations);
        return (
          <li {...props} key={option.id}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography fontWeight="bold">{getFullCristinName(option.names)}</Typography>
              {activeAffiliations.length > 0 && (
                <AffiliationHierarchy unitUri={activeAffiliations[0].organization} commaSeparated />
              )}
              {activeAffiliations.length > 1 && (
                <Typography fontStyle="italic">
                  {t('common.x_other_employments', { count: activeAffiliations.length - 1 })}
                </Typography>
              )}
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          isLoading={personSearchQuery.isLoading}
          data-testid={dataTestId.aggregations.contributorFacetsSearchField}
          aria-label={t('search.search_for_contributor')}
          placeholder={t('search.search_for_contributor')}
          showSearchIcon
        />
      )}
      slotProps={{
        listbox: {
          component: AutocompleteListboxWithExpansion,
          ...({
            hasMoreHits: !!personSearchQuery.data?.size && personSearchQuery.data.size > searchSize,
            onShowMoreHits: () => setSearchSize(searchSize + defaultPersonSearchSize),
            isLoadingMoreHits: personSearchQuery.isFetching && searchSize > options.length,
          } satisfies AutocompleteListboxWithExpansionProps),
        },
      }}
    />
  );
};
