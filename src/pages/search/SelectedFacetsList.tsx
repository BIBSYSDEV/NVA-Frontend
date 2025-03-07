import { Box } from '@mui/material';
import { useSearchParams } from 'react-router';
import { PersonAggregations } from '../../types/user.types';
import { SelectedFacetButton } from './SelectedFacetButton';

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
    <Box component="ul" sx={{ m: '0 0 0.5rem 0', p: 0, display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
      {selectedFacets.map(({ param, value }) => (
        <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} aggregations={aggregations} />
      ))}
    </Box>
  );
};
