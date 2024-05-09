import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam, removeSearchParamValue } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';

type PersonFacetsFilterProps = Pick<SearchPageProps, 'personQuery'>;

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
    newSearchParams.set(SearchParam.Page, '1');
    history.push({ search: newSearchParams.toString() });
  };

  const removeFacetFilter = (parameter: PersonSearchParameter, keyToRemove: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, parameter, keyToRemove);
    newSearchParams.set(SearchParam.Page, '1');
    history.push({ search: newSearchParams.toString() });
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

      {sectorFacet && sectorFacet?.length > 0 && (
        <FacetItem title={t('search.sector')} dataTestId={dataTestId.startPage.sectorFacets}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
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
