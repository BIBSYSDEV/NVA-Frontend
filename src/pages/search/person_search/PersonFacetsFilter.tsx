import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson, PersonAggregations } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';

interface PersonFacetsFilterProps {
  personQuery: UseQueryResult<SearchResponse<CristinPerson, PersonAggregations>>;
}

export const PersonFacetsFilter = ({ personQuery }: PersonFacetsFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const organizationFacet = personQuery.data?.aggregations?.organizationFacet;
  const sectorFacet = personQuery.data?.aggregations?.sectorFacet;

  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const selectedOrganizations = searchParams.get(PersonSearchParameter.Organization)?.split(',') ?? [];
  const selectedSectors = searchParams.get(PersonSearchParameter.Sector)?.split(',') ?? [];

  const addFacetFilter = (id: string) => {
    const searchParameters = new URL(id).searchParams;

    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );

    history.push({ search: newSearchParams.toString() });
  };

  const removeOrganizationFacetFilter = (keyToRemove: string) => {
    const newOrganizationsFilter = selectedOrganizations.filter((organization) => organization !== keyToRemove);
    searchParams.set(PersonSearchParameter.Organization, newOrganizationsFilter.join(','));
    history.push({ search: searchParams.toString() });
  };

  const removeSectorFacetFilter = (keyToRemove: string) => {
    const newSectorFilter = selectedSectors.filter((sector) => sector !== keyToRemove);
    searchParams.set(PersonSearchParameter.Sector, newSectorFilter.join(','));
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

      {sectorFacet && sectorFacet?.length > 0 && (
        <FacetItem title={t('search.sector')} dataTestId={dataTestId.startPage.sectorFacets}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={personQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() => (isSelected ? removeSectorFacetFilter(facet.key) : addFacetFilter(facet.id))}
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
