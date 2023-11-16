import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';

type ProjectFacetsFilterProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectFacetsFilter = ({ projectQuery }: ProjectFacetsFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const categoryFacet = projectQuery.data?.aggregations?.categoryFacet;
  const sectorFacet = projectQuery.data?.aggregations?.sectorFacet;

  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const selectedCategories = searchParams.get(ProjectSearchParameter.CategoryFacet)?.split(',') ?? [];
  const selectedSectors = searchParams.get(ProjectSearchParameter.SectorFacet)?.split(',') ?? [];

  const addFacetFilter = (id: string) => {
    const searchParameters = new URL(id).searchParams;

    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );

    history.push({ search: newSearchParams.toString() });
  };

  // const removeOrganizationFacetFilter = (keyToRemove: string) => {
  //   const newOrganizationsFilter = selectedOrganizations.filter((organization) => organization !== keyToRemove);
  //   searchParams.set(PersonSearchParameter.Organization, newOrganizationsFilter.join(','));
  //   history.push({ search: searchParams.toString() });
  // };

  // const removeSectorFacetFilter = (keyToRemove: string) => {
  //   const newSectorFilter = selectedSectors.filter((sector) => sector !== keyToRemove);
  //   searchParams.set(PersonSearchParameter.Sector, newSectorFilter.join(','));
  //   history.push({ search: searchParams.toString() });
  // };

  return (
    <>
      {categoryFacet && categoryFacet?.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.startPage.institutionFacets}>
          {categoryFacet.map((facet) => {
            const isSelected = selectedCategories.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() => (isSelected ? null : addFacetFilter(facet.id))}
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
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() => (isSelected ? null : addFacetFilter(facet.id))}
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
