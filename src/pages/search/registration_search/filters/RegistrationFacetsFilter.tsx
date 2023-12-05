import { ListItem, ListItemButton, styled } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchFieldName } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType, RegistrationAggregations } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { SearchPageProps } from '../../SearchPage';

interface RegistrationFacetsFilterProps {
  aggregations: RegistrationAggregations;
  isLoadingSearch: boolean;
}

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',
  '&.Mui-selected': {
    background: theme.palette.info.light,
  },
}));

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();
  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);

  const properties = values.properties ?? [];

  const updateFilter = (fieldName: string, value: string) => {
    const shouldRemoveThisSearchParam = properties.some((searchProperty) => searchProperty.value === value);

    if (shouldRemoveThisSearchParam) {
      const updatedFilter = properties.filter((filter) => filter.fieldName !== fieldName || filter.value !== value);
      setFieldValue('properties', updatedFilter);
    } else {
      const newFilter: PropertySearch = {
        fieldName,
        value,
        operator: ExpressionStatement.Contains,
      };
      const updatedFilter = [...properties, newFilter];
      setFieldValue('properties', updatedFilter);
    }
    submitForm();
  };

  const selectedCategory = searchParams.get('instanceType');

  const topLevelOrganizationFacet = registrationQuery.data?.aggregations?.topLevelOrganization;
  const typeFacet = registrationQuery.data?.aggregations?.instanceType;
  // const contributorFacet = registrationQuery.data?.aggregations?.contributors;
  const fundingFacet = registrationQuery.data?.aggregations?.fundingSource;

  function addFacetFilter(param: string, key: string): void {
    searchParams.set(param, key);
    history.push({ search: searchParams.toString() });
  }

  const removeFacetFilter = (param: string) => {
    searchParams.delete(param);
    history.push({ search: searchParams.toString() });
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
                  isSelected ? removeFacetFilter('instanceType') : addFacetFilter('instanceType', facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {topLevelOrganizationFacet && topLevelOrganizationFacet.length > 0 && (
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.startPage.institutionFacets}>
          {topLevelOrganizationFacet.map((organizationAggregation) => (
            <ListItem
              disablePadding
              key={organizationAggregation.key}
              data-testid={dataTestId.startPage.facetItem(getIdentifierFromId(organizationAggregation.key))}>
              <StyledListItemButton
                disabled={registrationQuery.isLoading}
                onClick={() => updateFilter(SearchFieldName.TopLevelOrganizationId, organizationAggregation.key)}
                selected={properties.some(
                  (searchProperty) =>
                    typeof searchProperty.value === 'string' && searchProperty.value === organizationAggregation.key
                )}>
                <span>{getLanguageString(organizationAggregation.labels)}</span>
                {organizationAggregation.count && <span>({organizationAggregation.count.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
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
          {fundingFacet.map((fundingAggregation) => (
            <ListItem
              disablePadding
              key={fundingAggregation.key}
              data-testid={dataTestId.startPage.facetItem(fundingAggregation.key)}>
              <StyledListItemButton
                disabled={registrationQuery.isLoading}
                onClick={() => updateFilter(SearchFieldName.FundingSource, fundingAggregation.key)}
                selected={properties.some(
                  (searchProperty) =>
                    typeof searchProperty.value === 'string' && searchProperty.value === fundingAggregation.key
                )}>
                <span>{getLanguageString(fundingAggregation.labels)}</span>
                {fundingAggregation.count && <span>({fundingAggregation.count.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )}
    </>
  );
};
