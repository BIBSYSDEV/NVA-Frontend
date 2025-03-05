import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';
import { SearchForInstitutionFacetItem } from '../registration_search/filters/SearchForInstitutionFacetItem';

type PersonFacetsFilterProps = Pick<SearchPageProps, 'personQuery'>;

export const PersonFacetsFilter = ({ personQuery }: PersonFacetsFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const organizationFacet = personQuery.data?.aggregations?.organizationFacet ?? [];
  const sectorFacet = personQuery.data?.aggregations?.sectorFacet ?? [];

  const searchParams = new URLSearchParams(location.search);

  const selectedOrganizations = searchParams.get(PersonSearchParameter.Organization)?.split(',') ?? [];
  const selectedSectors = searchParams.get(PersonSearchParameter.Sector)?.split(',') ?? [];

  const addFacetFilter = (param: PersonSearchParameter, key: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const currentValues = syncedParams.get(param)?.split(',') ?? [];
    if (currentValues.length === 0) {
      syncedParams.set(param, key);
    } else {
      syncedParams.set(param, [...currentValues, key].join(','));
    }
    syncedParams.delete(PersonSearchParameter.Page);
    navigate({ search: syncedParams.toString() });
  };

  const removeFacetFilter = (parameter: PersonSearchParameter, keyToRemove: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const newSearchParams = removeSearchParamValue(syncedParams, parameter, keyToRemove);
    newSearchParams.delete(PersonSearchParameter.Page);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {(personQuery.isPending || organizationFacet.length > 0) && (
        <FacetItem
          title={t('common.institution')}
          dataTestId={dataTestId.aggregations.institutionFacets}
          isPending={personQuery.isPending}
          renderCustomSelect={
            <SearchForInstitutionFacetItem
              onSelectInstitution={(identifier) =>
                addFacetFilter(PersonSearchParameter.Organization, identifier.split('.')[0])
              }
            />
          }>
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
                    : addFacetFilter(PersonSearchParameter.Organization, facet.key)
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
                  isSelected
                    ? removeFacetFilter(PersonSearchParameter.Sector, facet.key)
                    : addFacetFilter(PersonSearchParameter.Sector, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
