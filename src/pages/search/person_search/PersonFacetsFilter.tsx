import { ListItem, ListItemButton, Typography, styled } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson, PersonAggregations } from '../../../types/user.types';
import { SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../registration_search/filters/FacetItem';

interface PersonFacetsFilterProps {
  personQuery: UseQueryResult<SearchResponse<CristinPerson, unknown, PersonAggregations>>;
}

export const PersonFacetsFilter = ({ personQuery }: PersonFacetsFilterProps) => {
  const history = useHistory();
  const organizationFacet = personQuery.data?.facets?.organizationFacet;

  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const onClickFacet = (id: string) => {
    const searchParameters = new URL(id).searchParams;

    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );

    history.push({ search: newSearchParams.toString() });
  };

  const selectedOrganizations = searchParams.get('organizationFacet')?.split(',') ?? [];

  return (
    <>
      {organizationFacet && organizationFacet?.length > 0 && (
        <FacetItem title="Institusjon" dataTestId="TODO">
          {organizationFacet.map((facet) => (
            <FacetListItem
              key={facet.key}
              identifier={facet.key}
              dataTestId="sdf"
              isLoading={personQuery.isLoading}
              isSelected={selectedOrganizations.includes(facet.key)}
              label={getLanguageString(facet.labels)}
              count={facet.count}
              onClickFacet={() => onClickFacet(facet.id)} // TODO: Handle remove
            />
          ))}
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
