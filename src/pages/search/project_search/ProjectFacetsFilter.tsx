import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam, removeSearchParamValue } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { FacetItem } from '../FacetItem';
import { FacetListItem } from '../FacetListItem';
import { SearchPageProps } from '../SearchPage';

type ProjectFacetsFilterProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectFacetsFilter = ({ projectQuery }: ProjectFacetsFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const sectorFacet = projectQuery.data?.aggregations?.sectorFacet;
  const coordinatingFacet = projectQuery.data?.aggregations?.coordinatingFacet;
  const healthProjectFacet = projectQuery.data?.aggregations?.healthProjectFacet;
  const responsibleFacet = projectQuery.data?.aggregations?.responsibleFacet;
  const participantOrgFacet = projectQuery.data?.aggregations?.participantOrgFacet;
  const categoryFacet = projectQuery.data?.aggregations?.categoryFacet;
  const participantFacet = projectQuery.data?.aggregations?.participantFacet;
  const fundingSourceFacet = projectQuery.data?.aggregations?.fundingSourceFacet;

  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchType = searchParams.get(SearchParam.Type);

  const selectedCoordinating = searchParams.get(ProjectSearchParameter.CoordinatingFacet)?.split(',') ?? [];
  const selectedSectors = searchParams.get(ProjectSearchParameter.SectorFacet)?.split(',') ?? [];
  const selectedHealthProject = searchParams.get(ProjectSearchParameter.HealthProjectFacet)?.split(',') ?? [];
  const selectedResponsible = searchParams.get(ProjectSearchParameter.ResponsibleFacet)?.split(',') ?? [];
  const selectedParticipantOrg = searchParams.get(ProjectSearchParameter.ParticipantOrgFacet)?.split(',') ?? [];
  const selecetedCategories = searchParams.get(ProjectSearchParameter.CategoryFacet)?.split(',') ?? [];
  const selectedParticipants = searchParams.get(ProjectSearchParameter.ParticipantFacet)?.split(',') ?? [];
  const selectedFundingSources = searchParams.get(ProjectSearchParameter.FundingSourceFacet)?.split(',') ?? [];

  const addFacetFilter = (id: string) => {
    const searchParameters = new URL(id).searchParams;
    const newSearchParams = new URLSearchParams(
      `${SearchParam.Type}=${currentSearchType}&${searchParameters.toString()}`
    );
    newSearchParams.set(SearchParam.Page, '1');
    history.push({ search: newSearchParams.toString() });
  };

  const removeFacetFilter = (parameter: ProjectSearchParameter, keyToRemove: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, parameter, keyToRemove);
    newSearchParams.set(SearchParam.Page, '1');
    history.push({ search: newSearchParams.toString() });
  };

  return (
    <>
      {coordinatingFacet && coordinatingFacet?.length > 0 && (
        <FacetItem title={t('project.coordinating_institution')} dataTestId={dataTestId.startPage.coordinatingFacets}>
          {coordinatingFacet.map((facet) => {
            const isSelected = selectedCoordinating.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.CoordinatingFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {responsibleFacet && responsibleFacet?.length > 0 && (
        <FacetItem title={t('search.responsible_institution')} dataTestId={dataTestId.startPage.responsibleFacets}>
          {responsibleFacet.map((facet) => {
            const isSelected = selectedResponsible.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ResponsibleFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {participantOrgFacet && participantOrgFacet?.length > 0 && (
        <FacetItem title={t('search.participating_institution')} dataTestId={dataTestId.startPage.participantOrgFacets}>
          {participantOrgFacet.map((facet) => {
            const isSelected = selectedParticipantOrg.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ParticipantOrgFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {sectorFacet && sectorFacet?.length > 0 && (
        <FacetItem title={t('search.sector')} dataTestId={dataTestId.startPage.sectorFacets}>
          {sectorFacet.map((facet) => {
            const isSelected = selectedSectors.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.SectorFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {categoryFacet && categoryFacet?.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.startPage.categoryFacets}>
          {categoryFacet.map((facet) => {
            const isSelected = selecetedCategories.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.CategoryFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {healthProjectFacet && healthProjectFacet?.length > 0 && (
        <FacetItem title={t('search.health_project_type')} dataTestId={dataTestId.startPage.healthProjectFacets}>
          {healthProjectFacet.map((facet) => {
            const isSelected = selectedHealthProject.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.HealthProjectFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {participantFacet && participantFacet?.length > 0 && (
        <FacetItem title={t('search.participant')} dataTestId={dataTestId.startPage.participantFacets}>
          {participantFacet.map((facet) => {
            const isSelected = selectedParticipants.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.ParticipantFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {fundingSourceFacet && fundingSourceFacet?.length > 0 && (
        <FacetItem title={t('common.funding')} dataTestId={dataTestId.startPage.fundingSourceFacets}>
          {fundingSourceFacet.map((facet) => {
            const isSelected = selectedFundingSources.includes(facet.key);
            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={projectQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ProjectSearchParameter.FundingSourceFacet, facet.key)
                    : addFacetFilter(facet.id)
                }
              />
            );
          })}
        </FacetItem>
      )}
    </>
  );
};
