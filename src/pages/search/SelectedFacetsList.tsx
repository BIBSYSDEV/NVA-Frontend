import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ResultParam } from '../../api/searchApi';
import { dataTestId } from '../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../utils/searchHelpers';

interface SelectedFacet {
  param: string;
  value: string;
}

const getSelectedFacetsArray = (searchParams: URLSearchParams): SelectedFacet[] =>
  Array.from(searchParams).flatMap(([param, value]) =>
    value.split(',').map((thisValue) => ({ param, value: thisValue }))
  );

export const SelectedFacetsList = () => {
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams);

  // TODO: Should be <ul>?
  return (
    <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
      {selectedFacets.map(({ param, value }) => (
        <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} />
      ))}
    </Box>
  );
};

const SelectedFacetButton = ({ param, value }: SelectedFacet) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
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
      {param}: {value}
    </Button>
  );
};
