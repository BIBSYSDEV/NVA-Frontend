import { useSearchParams } from 'react-router';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { PersonAggregations } from '../../../types/user.types';
import { SelectedFacetsList } from './SelectedFacetsList';
import { SelectedPersonFacetButton } from './SelectedPersonFacetButton';
import { getSelectedFacetsArray } from './facetHelpers';

const personFacetParams: string[] = [PersonSearchParameter.Organization, PersonSearchParameter.Sector];

interface SelectedPersonFacetsListProps {
  aggregations?: PersonAggregations;
}

export const SelectedPersonFacetsList = ({ aggregations }: SelectedPersonFacetsListProps) => {
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, personFacetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <SelectedFacetsList>
      {selectedFacets.map(({ param, value }) => (
        <SelectedPersonFacetButton key={`${param}-${value}`} param={param} value={value} aggregations={aggregations} />
      ))}
    </SelectedFacetsList>
  );
};
