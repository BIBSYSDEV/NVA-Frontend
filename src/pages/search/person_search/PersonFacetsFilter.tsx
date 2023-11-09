import { ListItem, ListItemButton, Typography, styled } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson, PersonAggregations } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../registration_search/filters/FacetItem';

interface PersonFacetsFilterProps {
  personQuery: UseQueryResult<SearchResponse<CristinPerson, unknown, PersonAggregations>>;
}

export const PersonFacetsFilter = ({ personQuery }: PersonFacetsFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const organizationFacet = personQuery.data?.facets?.organizationFacet;

  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);
  const selectedOrganizations = searchParams.get('organizationFacet')?.split(',') ?? [];

  const addFacetFilter = (id: string) => {
    const searchParameters = new URL(id).searchParams;

    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );

    history.push({ search: newSearchParams.toString() });
  };

  const removeOrganizationFacetFilter = (keyToRemove: string) => {
    const newOrganizationsFilter = selectedOrganizations.filter((organization) => organization !== keyToRemove);
    searchParams.set('organizationFacet', newOrganizationsFilter.join(','));
    history.push({ search: searchParams.toString() });
  };

  return (
    <>
      {organizationFacet && organizationFacet?.length > 0 && (
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.startPage.institutionFacets}>
          {organizationFacet.map((facet) => {
            const isSelected = selectedOrganizations.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={personQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() => (isSelected ? removeOrganizationFacetFilter(facet.key) : addFacetFilter(facet.id))}
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',
  '&.Mui-selected': {
    background: theme.palette.info.light,
  },
}));

interface FacetListItemProps {
  identifier: string;
  dataTestId: string;
  isLoading: boolean;
  isSelected: boolean;
  onClickFacet: () => void;
  label: string;
  count: number;
}

const FacetListItem = ({
  identifier,
  dataTestId,
  isLoading,
  isSelected,
  label,
  count,
  onClickFacet,
}: FacetListItemProps) => (
  <ListItem disablePadding key={identifier} data-testid={dataTestId}>
    <StyledListItemButton disabled={isLoading} selected={isSelected} onClick={onClickFacet}>
      <Typography component="span" sx={{ wordBreak: 'break-word' }}>
        {label}
      </Typography>
      {count && <Typography component="span">({count.toLocaleString()})</Typography>}
    </StyledListItemButton>
  </ListItem>
);
