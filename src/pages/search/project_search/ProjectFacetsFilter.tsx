import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, SearchParam } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';
import { ProjectStatusFilter } from './ProjectStatusFilter';

type ProjectFacetsFilterProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectFacetsFilter = ({ projectQuery }: ProjectFacetsFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sectorFacet = projectQuery.data?.aggregations?.sectorFacet;
  const coordinatingFacet = projectQuery.data?.aggregations?.coordinatingFacet;
  const healthProjectFacet = projectQuery.data?.aggregations?.healthProjectFacet;
  const responsibleFacet = projectQuery.data?.aggregations?.responsibleFacet;
  const participantOrgFacet = projectQuery.data?.aggregations?.participantOrgFacet;
  const categoryFacet = projectQuery.data?.aggregations?.categoryFacet;
  const participantFacet = projectQuery.data?.aggregations?.participantFacet;
  const fundingSourceFacet = projectQuery.data?.aggregations?.fundingSourceFacet;

  const searchParams = new URLSearchParams(location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const selectedCoordinating = searchParams.get(ProjectSearchParameter.CoordinatingFacet)?.split(',') ?? [];
  const selectedSectors = searchParams.get(ProjectSearchParameter.SectorFacet)?.split(',') ?? [];
  const selectedHealthProject = searchParams.get(ProjectSearchParameter.HealthProjectFacet)?.split(',') ?? [];
  const selectedResponsible = searchParams.get(ProjectSearchParameter.ResponsibleFacet)?.split(',') ?? [];
  const selectedParticipantOrg = searchParams.get(ProjectSearchParameter.ParticipantOrgFacet)?.split(',') ?? [];
  const selecetedCategories = searchParams.get(ProjectSearchParameter.CategoryFacet)?.split(',') ?? [];
  const selectedParticipants = searchParams.get(ProjectSearchParameter.ParticipantFacet)?.split(',') ?? [];
  const selectedFundingSources = searchParams.get(ProjectSearchParameter.FundingSourceFacet)?.split(',') ?? [];

  const addFacetFilter = (param: ProjectSearchParameter, key: string) => {
    const currentValues = searchParams.get(param)?.split(',') ?? [];
    if (currentValues.length === 0) {
      searchParams.set(param, key);
    } else {
      searchParams.set(param, [...currentValues, key].join(','));
    }
    searchParams.set(SearchParam.Type, currentSearchType ?? '');
    searchParams.set(SearchParam.Page, '1');
    navigate({ search: searchParams.toString() });
  };

  const removeFacetFilter = (parameter: ProjectSearchParameter, keyToRemove: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, parameter, keyToRemove);
    newSearchParams.set(SearchParam.Page, '1');
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {coordinatingFacet && coordinatingFacet?.length > 0 && (
        <FacetItem
          title={t('project.coordinating_institution')}
          dataTestId={dataTestId.aggregations.coordinatingFacets}>
          {coordinatingFacet.map((facet) => {
            const isSelected = selectedCoordinating.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.CoordinatingFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.CoordinatingFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {responsibleFacet && responsibleFacet?.length > 0 && (
        <FacetItem title={t('search.responsible_institution')} dataTestId={dataTestId.aggregations.responsibleFacets}>
          {responsibleFacet.map((facet) => {
            const isSelected = selectedResponsible.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ResponsibleFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.ResponsibleFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {participantOrgFacet && participantOrgFacet?.length > 0 && (
        <FacetItem
          title={t('search.participating_institution')}
          dataTestId={dataTestId.aggregations.participantOrgFacets}>
          {participantOrgFacet.map((facet) => {
            const isSelected = selectedParticipantOrg.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ParticipantOrgFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.ParticipantOrgFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {sectorFacet && sectorFacet?.length > 0 && (
        <FacetItem title={t('search.sector')} dataTestId={dataTestId.aggregations.sectorFacets}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.SectorFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.SectorFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {categoryFacet && categoryFacet?.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.aggregations.categoryFacets}>
          {categoryFacet.map((facet) => {
            const isSelected = selecetedCategories.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.CategoryFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.CategoryFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {healthProjectFacet && healthProjectFacet?.length > 0 && (
        <FacetItem title={t('search.health_project_type')} dataTestId={dataTestId.aggregations.healthProjectFacets}>
          {healthProjectFacet.map((facet) => {
            const isSelected = selectedHealthProject.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.HealthProjectFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.HealthProjectFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {participantFacet && participantFacet?.length > 0 && (
        <FacetItem title={t('search.participant')} dataTestId={dataTestId.aggregations.participantFacets}>
          {participantFacet.map((facet) => {
            const isSelected = selectedParticipants.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ParticipantFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.ParticipantFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {fundingSourceFacet && fundingSourceFacet?.length > 0 && (
        <FacetItem title={t('common.funding')} dataTestId={dataTestId.aggregations.fundingSourceFacets}>
          {fundingSourceFacet.map((facet) => {
            const isSelected = selectedFundingSources.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={projectQuery.isPending}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.FundingSourceFacet, facet.key)
                    : addFacetFilter(ProjectSearchParameter.FundingSourceFacet, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      <ProjectStatusFilter />
    </>
  );
};
