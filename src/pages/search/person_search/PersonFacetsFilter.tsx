import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';

type PersonFacetsFilterProps = Pick<SearchPageProps, 'personQuery'>;

export const PersonFacetsFilter = ({ personQuery }: PersonFacetsFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const organizationFacet = personQuery.data?.aggregations?.organizationFacet ?? [];
  const sectorFacet = personQuery.data?.aggregations?.sectorFacet ?? [];

  const searchParams = new URLSearchParams(location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const selectedOrganizations = searchParams.get(PersonSearchParameter.Organization)?.split(',') ?? [];
  const selectedSectors = searchParams.get(PersonSearchParameter.Sector)?.split(',') ?? [];

  const addFacetFilter = (id: string) => {
    const searchParameters = new URL(id).searchParams;
    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );
    newSearchParams.delete(SearchParam.Page);
    navigate({ search: newSearchParams.toString() });
  };

  const removeFacetFilter = (parameter: PersonSearchParameter, keyToRemove: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, parameter, keyToRemove);
    newSearchParams.delete(SearchParam.Page);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {(personQuery.isPending || organizationFacet.length > 0) && (
        <FacetItem
          title={t('common.institution')}
          dataTestId={dataTestId.aggregations.institutionFacets}
          isPending={personQuery.isPending}>
          {organizationFacet.map((facet) => {
            const isSelected = selectedOrganizations.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={personQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(PersonSearchParameter.Organization, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {(personQuery.isPending || sectorFacet.length > 0) && (
        <FacetItem
          title={t('search.sector')}
          dataTestId={dataTestId.aggregations.sectorFacets}
          isPending={personQuery.isPending}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={personQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected ? removeFacetFilter(PersonSearchParameter.Sector, facet.key) : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
