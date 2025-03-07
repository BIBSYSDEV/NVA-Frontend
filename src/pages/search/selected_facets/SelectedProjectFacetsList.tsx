import { useSearchParams } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { ProjectAggregations } from '../../../types/project.types';
import { getSelectedFacetsArray } from './facetHelpers';
import { SelectedFacetsList } from './SelectedFacetsList';
import { SelectedProjectFacetButton } from './SelectedProjectFacetButton';

const projectFacetParams: string[] = [
  ProjectSearchParameter.CategoryFacet,
  ProjectSearchParameter.CoordinatingFacet,
  ProjectSearchParameter.FundingSourceFacet,
  ProjectSearchParameter.HealthProjectFacet,
  ProjectSearchParameter.ParticipantFacet,
  ProjectSearchParameter.ParticipantOrgFacet,
  ProjectSearchParameter.ResponsibleFacet,
  ProjectSearchParameter.SectorFacet,
];

interface SelectedProjectFacetsListProps {
  aggregations?: ProjectAggregations;
}

export const SelectedProjectFacetsList = ({ aggregations }: SelectedProjectFacetsListProps) => {
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, projectFacetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <SelectedFacetsList>
      {selectedFacets.map(({ param, value }) => (
        <SelectedProjectFacetButton key={`${param}-${value}`} param={param} value={value} aggregations={aggregations} />
      ))}
    </SelectedFacetsList>
  );
};
