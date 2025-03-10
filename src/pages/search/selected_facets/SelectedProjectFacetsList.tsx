import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { ProjectAggregations } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import {
  SelectedFundingFacetButton,
  SelectedInstitutionFacetButton,
  SelectedPersonFacetButton,
} from '../registration_search/RegistrationSearchBar';
import { getSectorValueContent, getSelectedFacetsArray } from './facetHelpers';
import { SelectedProjectCategoryFacetButton } from './SelectedCategoryFacetButton';
import { SelectedFacetButton } from './SelectedFacetButton';
import { SelectedFacetsList } from './SelectedFacetsList';

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
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, projectFacetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <SelectedFacetsList>
      {selectedFacets.map(({ param, value }) => {
        const paramContent = getParamContent(t, param);
        const valueContent = getValueContent(t, param, value, aggregations);

        return (
          <SelectedFacetButton
            key={`${param}-${value}`}
            param={param}
            value={value}
            content={
              <>
                {paramContent}: {valueContent}
              </>
            }
          />
        );
      })}
    </SelectedFacetsList>
  );
};

const getParamContent = (t: TFunction, param: string) => {
  switch (param) {
    case ProjectSearchParameter.CoordinatingFacet:
      return t('project.coordinating_institution');
    case ProjectSearchParameter.ResponsibleFacet:
      return t('search.responsible_institution');
    case ProjectSearchParameter.ParticipantOrgFacet:
      return t('search.participating_institution');
    case ProjectSearchParameter.SectorFacet:
      return t('search.sector');
    case ProjectSearchParameter.CategoryFacet:
      return t('common.category');
    case ProjectSearchParameter.HealthProjectFacet:
      return t('search.health_project_type');
    case ProjectSearchParameter.ParticipantFacet:
      return t('search.participant');
    case ProjectSearchParameter.FundingSourceFacet:
      return t('common.financier');
    default:
      return param || t('common.unknown');
  }
};

const getValueContent = (t: TFunction, param: string, value: string, aggregations?: ProjectAggregations) => {
  switch (param) {
    case ProjectSearchParameter.CoordinatingFacet: {
      const institutionLabels = aggregations?.coordinatingFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        return <SelectedInstitutionFacetButton institutionIdentifier={value} />;
      }
    }
    case ProjectSearchParameter.ResponsibleFacet: {
      const institutionLabels = aggregations?.responsibleFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        return <SelectedInstitutionFacetButton institutionIdentifier={value} />;
      }
    }
    case ProjectSearchParameter.ParticipantOrgFacet: {
      const institutionLabels = aggregations?.participantOrgFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        return <SelectedInstitutionFacetButton institutionIdentifier={`${value}.0.0.0`} />;
      }
    }
    case ProjectSearchParameter.SectorFacet: {
      const sectorLabels = aggregations?.sectorFacet?.find((bucket) => bucket.key === value)?.labels;
      return getSectorValueContent(t, value, sectorLabels);
    }
    case ProjectSearchParameter.CategoryFacet: {
      const categoryLabels = aggregations?.categoryFacet?.find((bucket) => bucket.key === value)?.labels;
      const categoryName = getLanguageString(categoryLabels);
      if (categoryName) {
        return categoryName;
      } else {
        return <SelectedProjectCategoryFacetButton value={value} />;
      }
    }
    case ProjectSearchParameter.HealthProjectFacet: {
      const healthProjectLabels = aggregations?.healthProjectFacet?.find((bucket) => bucket.key === value)?.labels;
      const healthProjectName = getLanguageString(healthProjectLabels);
      if (healthProjectName) {
        return healthProjectName;
      } else {
        return value;
      }
    }
    case ProjectSearchParameter.ParticipantFacet: {
      const participantLabels = aggregations?.participantFacet?.find((bucket) => bucket.key === value)?.labels;
      const participantName = getLanguageString(participantLabels);
      if (participantName) {
        return participantName;
      } else {
        return <SelectedPersonFacetButton personIdentifier={value} />;
      }
    }
    case ProjectSearchParameter.FundingSourceFacet: {
      const fundingSourceLabels = aggregations?.fundingSourceFacet?.find((bucket) => bucket.key === value)?.labels;
      const fundingSourceName = getLanguageString(fundingSourceLabels);
      if (fundingSourceName) {
        return fundingSourceName;
      } else {
        return <SelectedFundingFacetButton fundingIdentifier={value} />;
      }
    }
    default:
      return value || t('common.unknown');
  }
};
