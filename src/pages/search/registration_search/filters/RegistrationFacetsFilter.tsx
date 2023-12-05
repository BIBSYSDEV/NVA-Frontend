import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { removeSearchParamValue } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { SearchPageProps } from '../../SearchPage';

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedCategory = searchParams.get('type');
  const selectedOrganization = searchParams.get('topLevelOrganization');
  const selectedFunding = searchParams.get('fundingSource');

  const typeFacet = registrationQuery.data?.aggregations?.type;
  const topLevelOrganizationFacet = registrationQuery.data?.aggregations?.topLevelOrganization;

  // const contributorFacet = registrationQuery.data?.aggregations?.contributors;
  const fundingFacet = registrationQuery.data?.aggregations?.fundingSource;

  const addFacetFilter = (param: string, key: string) => {
    searchParams.set(param, key);
    history.push({ search: searchParams.toString() });
  };

  const removeFacetFilter = (param: string, key: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, param, key);
    history.push({ search: newSearchParams.toString() });
  };

  return (
    <>
      {typeFacet && typeFacet.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.startPage.typeFacets}>
          {typeFacet.map((facet) => {
            const registrationType = facet.key as PublicationInstanceType;
            const isSelected = selectedCategory === registrationType;

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={t(`registration.publication_types.${registrationType}`)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected ? removeFacetFilter('type', facet.key) : addFacetFilter('type', facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {topLevelOrganizationFacet && topLevelOrganizationFacet.length > 0 && (
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.startPage.institutionFacets}>
          {topLevelOrganizationFacet.map((facet) => {
            const isSelected = selectedOrganization === facet.key;

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || getIdentifierFromId(facet.key)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter('topLevelOrganization', facet.key)
                    : addFacetFilter('topLevelOrganization', facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {/* {contributorFacet && contributorFacet.length > 0 && (
        <FacetItem
          title={t('registration.contributors.contributor')}
          dataTestId={dataTestId.startPage.contributorFacets}>
          {contributorFacet.buckets.map((contributorAggregation) => (
            <ListItem
              disablePadding
              key={contributorAggregation.key}
              data-testid={dataTestId.startPage.facetItem(getIdentifierFromId(contributorAggregation.key))}>
              <StyledListItemButton
                disabled={registrationQuery.isLoading}
                onClick={() => updateFilter(SearchFieldName.ContributorId, contributorAggregation.key)}
                selected={properties.some(
                  (searchProperty) => typeof searchProperty.value === 'string' && searchProperty.value === contributorAggregation.key
                )}>
                <span>
                  {contributorAggregation.name.buckets.length > 0 ? contributorAggregation.name.buckets[0].key : <i>{t('common.unknown')}</i>}
                </span>
                {contributorAggregation.count && <span>({contributorAggregation.count.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )} */}

      {fundingFacet && fundingFacet.length > 0 && (
        <FacetItem title={t('common.funding')} dataTestId={dataTestId.startPage.institutionFacets}>
          {fundingFacet.map((facet) => {
            const isSelected = selectedFunding === facet.key;

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter('fundingSource', facet.key)
                    : addFacetFilter('fundingSource', facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
