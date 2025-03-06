import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SearchForPersonFacetItem } from '../facet_search_fields/SearchForContributorFacetItem';
import { SearchForFundingSourceFacetItem } from '../facet_search_fields/SearchForFundingSourceFacetItem';
import { SearchForInstitutionFacetItem } from '../facet_search_fields/SearchForInstitutionFacetItem';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';
import { ProjectStatusFilter } from './ProjectStatusFilter';

type ProjectFacetsFilterProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectFacetsFilter = ({ projectQuery }: ProjectFacetsFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sectorFacet = projectQuery.data?.aggregations?.sectorFacet ?? [];
  const coordinatingFacet = projectQuery.data?.aggregations?.coordinatingFacet ?? [];
  const healthProjectFacet = projectQuery.data?.aggregations?.healthProjectFacet ?? [];
  const responsibleFacet = projectQuery.data?.aggregations?.responsibleFacet ?? [];
  const participantOrgFacet = projectQuery.data?.aggregations?.participantOrgFacet ?? [];
  const categoryFacet = projectQuery.data?.aggregations?.categoryFacet ?? [];
  const participantFacet = projectQuery.data?.aggregations?.participantFacet ?? [];
  const fundingSourceFacet = projectQuery.data?.aggregations?.fundingSourceFacet ?? [];

  const searchParams = new URLSearchParams(location.search);

  const selectedCoordinating = searchParams.get(ProjectSearchParameter.CoordinatingFacet)?.split(',') ?? [];
  const selectedSectors = searchParams.get(ProjectSearchParameter.SectorFacet)?.split(',') ?? [];
  const selectedHealthProject = searchParams.get(ProjectSearchParameter.HealthProjectFacet)?.split(',') ?? [];
  const selectedResponsible = searchParams.get(ProjectSearchParameter.ResponsibleFacet)?.split(',') ?? [];
  const selectedParticipantOrg = searchParams.get(ProjectSearchParameter.ParticipantOrgFacet)?.split(',') ?? [];
  const selecetedCategories = searchParams.get(ProjectSearchParameter.CategoryFacet)?.split(',') ?? [];
  const selectedParticipants = searchParams.get(ProjectSearchParameter.ParticipantFacet)?.split(',') ?? [];
  const selectedFundingSources = searchParams.get(ProjectSearchParameter.FundingSourceFacet)?.split(',') ?? [];

  const addFacetFilter = (param: ProjectSearchParameter, key: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const currentValues = syncedParams.get(param)?.split(',') ?? [];
    if (currentValues.length === 0) {
      syncedParams.set(param, key);
    } else {
      syncedParams.set(param, [...currentValues, key].join(','));
    }
    syncedParams.delete(ProjectSearchParameter.Page);
    navigate({ search: syncedParams.toString() });
  };

  const removeFacetFilter = (parameter: ProjectSearchParameter, keyToRemove: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const newSearchParams = removeSearchParamValue(syncedParams, parameter, keyToRemove);
    newSearchParams.delete(ProjectSearchParameter.Page);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {(projectQuery.isPending || coordinatingFacet.length > 0) && (
        <FacetItem
          title={t('project.coordinating_institution')}
          dataTestId={dataTestId.aggregations.coordinatingFacets}
          isPending={projectQuery.isPending}
          renderCustomSelect={
            <SearchForInstitutionFacetItem
              placeholder={t('search.search_for_coordinating_institution')}
              dataTestId={dataTestId.aggregations.coordinatingFacetsSearchField}
              onSelectInstitution={(identifier) => addFacetFilter(ProjectSearchParameter.CoordinatingFacet, identifier)}
            />
          }>
          {coordinatingFacet.map((facet) => {
            const isSelected = selectedCoordinating.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || responsibleFacet.length > 0) && (
        <FacetItem
          title={t('search.responsible_institution')}
          dataTestId={dataTestId.aggregations.responsibleFacets}
          isPending={projectQuery.isPending}
          renderCustomSelect={
            <SearchForInstitutionFacetItem
              placeholder={t('search.search_for_responsible_institution')}
              dataTestId={dataTestId.aggregations.responsibleFacetsSearchField}
              onSelectInstitution={(identifier) => addFacetFilter(ProjectSearchParameter.ResponsibleFacet, identifier)}
            />
          }>
          {responsibleFacet.map((facet) => {
            const isSelected = selectedResponsible.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || participantOrgFacet.length > 0) && (
        <FacetItem
          title={t('search.participating_institution')}
          dataTestId={dataTestId.aggregations.participantOrgFacets}
          isPending={projectQuery.isPending}
          renderCustomSelect={
            <SearchForInstitutionFacetItem
              placeholder={t('search.search_for_participating_institution')}
              dataTestId={dataTestId.aggregations.participantOrgFacetsSearchField}
              onSelectInstitution={(identifier) =>
                addFacetFilter(ProjectSearchParameter.ParticipantOrgFacet, identifier.split('.')[0])
              }
            />
          }>
          {participantOrgFacet.map((facet) => {
            const isSelected = selectedParticipantOrg.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || sectorFacet.length > 0) && (
        <FacetItem
          title={t('search.sector')}
          dataTestId={dataTestId.aggregations.sectorFacets}
          isPending={projectQuery.isPending}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || categoryFacet.length > 0) && (
        <FacetItem
          title={t('common.category')}
          dataTestId={dataTestId.aggregations.categoryFacets}
          isPending={projectQuery.isPending}>
          {categoryFacet.map((facet) => {
            const isSelected = selecetedCategories.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || healthProjectFacet.length > 0) && (
        <FacetItem
          title={t('search.health_project_type')}
          dataTestId={dataTestId.aggregations.healthProjectFacets}
          isPending={projectQuery.isPending}>
          {healthProjectFacet.map((facet) => {
            const isSelected = selectedHealthProject.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || participantFacet.length > 0) && (
        <FacetItem
          title={t('search.participant')}
          dataTestId={dataTestId.aggregations.participantFacets}
          isPending={projectQuery.isPending}
          renderCustomSelect={
            <SearchForPersonFacetItem
              placeholder={t('search.search_for_participant')}
              onSelectPerson={(identifier) => addFacetFilter(ProjectSearchParameter.ParticipantFacet, identifier)}
            />
          }>
          {participantFacet.map((facet) => {
            const isSelected = selectedParticipants.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(projectQuery.isPending || fundingSourceFacet.length > 0) && (
        <FacetItem
          title={t('common.financier')}
          dataTestId={dataTestId.aggregations.fundingSourceFacets}
          isPending={projectQuery.isPending}
          renderCustomSelect={
            <SearchForFundingSourceFacetItem
              onSelectFunder={(identifier) => addFacetFilter(ProjectSearchParameter.FundingSourceFacet, identifier)}
            />
          }>
          {fundingSourceFacet.map((facet) => {
            const isSelected = selectedFundingSources.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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
