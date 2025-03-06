import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { PersonSearchParameter } from '../../api/cristinApi';
import { ResultParam } from '../../api/searchApi';
import { PersonAggregations } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { SelectedInstitutionFacetButton } from './registration_search/RegistrationSearchBar';

interface SelectedFacet {
  param: string;
  value: string;
}

const getSelectedFacetsArray = (searchParams: URLSearchParams, facetParams: string[]): SelectedFacet[] =>
  Array.from(searchParams).flatMap(([param, value]) =>
    value
      .split(',')
      .map((thisValue) => ({ param, value: thisValue }))
      .filter(({ param }) => facetParams.includes(param))
  );

interface SelectedFacetsListProps {
  facetParams: string[];
  aggregations?: PersonAggregations;
}

export const SelectedFacetsList = ({ facetParams, aggregations }: SelectedFacetsListProps) => {
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, facetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <Box component="ul" sx={{ m: 0, p: 0, display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
      {selectedFacets.map(({ param, value }) => (
        <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} aggregations={aggregations} />
      ))}
    </Box>
  );
};

type SelectedFacetButtonProps = SelectedFacet & Pick<SelectedFacetsListProps, 'aggregations'>;

const SelectedFacetButton = ({ param, value, aggregations }: SelectedFacetButtonProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  let paramString = '';
  let valueString: ReactNode = '';

  switch (param) {
    case PersonSearchParameter.Organization: {
      paramString = t('common.institution');

      const institutionLabels = aggregations?.organizationFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        valueString = institutionName;
      } else {
        const institutionIdentifier = Number.isInteger(+value) ? `${value}.0.0.0` : value;
        valueString = <SelectedInstitutionFacetButton institutionIdentifier={institutionIdentifier} />;
      }
      break;
    }
    case PersonSearchParameter.Sector:
      paramString = t('search.sector');

      const sectorLabels = aggregations?.sectorFacet?.find((bucket) => bucket.key === value)?.labels;
      const sectorName = getLanguageString(sectorLabels);
      if (sectorName) {
        valueString = sectorName;
      } else {
        if (value === 'UC') {
          valueString = t('basic_data.institutions.sector_values.UHI');
        } else {
          valueString = t(`basic_data.institutions.sector_values.${value}`, { defaultValue: value });
        }
      }
      break;
    default:
      valueString = typeof value === 'string' ? value : t('common.unknown');
      break;
  }

  return (
    <li style={{ listStyleType: 'none' }}>
      <Button
        data-testid={dataTestId.startPage.advancedSearch.removeFacetButton}
        variant="outlined"
        size="small"
        title={t('search.remove_filter')}
        sx={{ textTransform: 'none' }}
        endIcon={<ClearIcon />}
        onClick={() => {
          const syncedParams = syncParamsWithSearchFields(searchParams);
          const newParams = removeSearchParamValue(syncedParams, param, value);
          newParams.delete(ResultParam.From);
          setSearchParams(newParams);
        }}>
        {paramString}: {valueString}
      </Button>
    </li>
  );
};
