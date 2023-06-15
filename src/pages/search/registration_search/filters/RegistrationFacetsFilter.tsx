import { Box, ListItem, ListItemButton, styled } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../../utils/searchHelpers';
import { FacetItem } from './FacetItem';
import { Aggregations } from '../../../../types/common.types';
import { ResourceFieldNames, SearchFieldName } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { getInstitutionLabelFromBucket } from '../../../../utils/translation-helpers';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';

interface RegistrationFacetsFilterProps {
  aggregations: Aggregations;
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

  const aggregationEntries = Object.entries(aggregations);
  const typeFacet = aggregationEntries.find(([fieldName]) => fieldName === ResourceFieldNames.RegistrationType)?.[1];
  const topLevelOrganizationFacet = aggregationEntries.find(
    ([fieldName]) => fieldName === SearchFieldName.TopLevelOrganization
  )?.[1].id;

  return (
    <>
      {typeFacet?.buckets && (
        <FacetItem title={t('registration.resource_type.resource_type')} dataTestId={dataTestId.startPage.typeFacets}>
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

      {topLevelOrganizationFacet?.buckets && (
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
                <span>{getInstitutionLabelFromBucket(bucket)}</span>
                {bucket.docCount && <span>({bucket.docCount.toLocaleString()})</span>}
              </StyledListItemButton>
            </ListItem>
          ))}
        </FacetItem>
      )}
    </>
  );
};
