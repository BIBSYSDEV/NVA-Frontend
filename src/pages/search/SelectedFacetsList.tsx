import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { PersonSearchParameter } from '../../api/cristinApi';
import { ResultParam } from '../../api/searchApi';
import { dataTestId } from '../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../utils/searchHelpers';

interface SelectedFacet {
  param: string;
  value: string;
}

const getSelectedFacetsArray = (searchParams: URLSearchParams, facetParams: string[]): SelectedFacet[] =>
  Array.from(searchParams).flatMap(
    ([param, value]) =>
      value
        .split(',')
        .map((thisValue) => ({ param, value: thisValue }))
        .filter(({ param }) => facetParams.includes(param)) // TODO: Filter earlier?
  );

interface SelectedFacetsListProps {
  facetParams: string[];
}

export const SelectedFacetsList = ({ facetParams }: SelectedFacetsListProps) => {
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, facetParams);

  return (
    <Box component="ul" sx={{ m: 0, p: 0, display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
      {selectedFacets.map(({ param, value }) => (
        <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} />
      ))}
    </Box>
  );
};

const SelectedFacetButton = ({ param, value }: SelectedFacet) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  let paramString = '';
  let valueString = '';

  switch (param) {
    case PersonSearchParameter.Organization:
      paramString = t('common.institution');
      valueString = value;
      break;
    case PersonSearchParameter.Sector:
      paramString = t('search.sector');
      valueString = t(`basic_data.institutions.sector_values.${value}` as any);
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
