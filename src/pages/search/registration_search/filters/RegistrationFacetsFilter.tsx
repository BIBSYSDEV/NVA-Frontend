import { Box, ListItem, ListItemButton, styled } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames, SearchFieldName } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType, RegistrationSearchAggregations } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../../utils/searchHelpers';
import { getLabelFromBucket } from '../../../../utils/translation-helpers';
import { FacetItem } from './FacetItem';

interface RegistrationFacetsFilterProps {
  aggregations: RegistrationSearchAggregations;
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

export const RegistrationFacetsFilter = ({ aggregations, isLoadingSearch }: RegistrationFacetsFilterProps) => {
  const { t } = useTranslation();
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

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

  const topLevelOrganizationFacet = aggregations.topLevelOrganization.id;
  const typeFacet = aggregations.entityDescription.reference.publicationInstance.type;
  const contributorFacet = aggregations.entityDescription.contributors.identity.id;
  const fundingFacet = aggregations.fundings.identifier;

  return (
    <>
      {typeFacet.buckets.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.startPage.typeFacets}>
          {typeFacet.buckets.map((bucket) => {
            const registrationType = bucket.key as PublicationInstanceType;
            return (
              <ListItem disablePadding key={registrationType} data-testid={dataTestId.startPage.facetItem(bucket.key)}>
                <StyledListItemButton
                  disabled={isLoadingSearch}
                  onClick={() => updateFilter(ResourceFieldNames.RegistrationType, registrationType)}
                  selected={properties.some((searchProperty) => searchProperty.value === registrationType)}>
                  <Box component="span" sx={{ wordBreak: 'break-word' }}>
                    {t(`registration.publication_types.${registrationType}`)}
                  </Box>
                  {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
                </StyledListItemButton>
              </ListItem>
            );
          })}
        </FacetItem>
      )}

      {topLevelOrganizationFacet.buckets.length > 0 && (
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.startPage.institutionFacets}>
          {topLevelOrganizationFacet.buckets.map((bucket) => (
            <ListItem
              disablePadding
              key={bucket.key}
              data-testid={dataTestId.startPage.facetItem(getIdentifierFromId(bucket.key))}>
              <StyledListItemButton
                disabled={isLoadingSearch}
                onClick={() => updateFilter(SearchFieldName.TopLevelOrganizationId, bucket.key)}
                selected={properties.some(
                  (searchProperty) => typeof searchProperty.value === 'string' && searchProperty.value === bucket.key
                )}>
                <span>{getLabelFromBucket(bucket)}</span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )}

      {contributorFacet.buckets.length > 0 && (
        <FacetItem
          title={t('registration.contributors.contributor')}
          dataTestId={dataTestId.startPage.contributorFacets}>
          {contributorFacet.buckets.map((bucket) => (
            <ListItem
              disablePadding
              key={bucket.key}
              data-testid={dataTestId.startPage.facetItem(getIdentifierFromId(bucket.key))}>
              <StyledListItemButton
                disabled={isLoadingSearch}
                onClick={() => updateFilter(SearchFieldName.ContributorId, bucket.key)}
                selected={properties.some(
                  (searchProperty) => typeof searchProperty.value === 'string' && searchProperty.value === bucket.key
                )}>
                <span>
                  {bucket.name.buckets.length > 0 ? bucket.name.buckets[0].key : <i>{t('common.unknown')}</i>}
                </span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )}

      {fundingFacet.buckets.length > 0 && (
        <FacetItem title={t('common.funding')} dataTestId={dataTestId.startPage.institutionFacets}>
          {fundingFacet.buckets.map((bucket) => (
            <ListItem disablePadding key={bucket.key} data-testid={dataTestId.startPage.facetItem(bucket.key)}>
              <StyledListItemButton
                disabled={isLoadingSearch}
                onClick={() => updateFilter(SearchFieldName.FundingSource, bucket.key)}
                selected={properties.some(
                  (searchProperty) => typeof searchProperty.value === 'string' && searchProperty.value === bucket.key
                )}>
                <span>{getLabelFromBucket(bucket)}</span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )}
    </>
  );
};
