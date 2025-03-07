import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { ProjectAggregations } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SelectedInstitutionFacetButton } from '../registration_search/RegistrationSearchBar';
import { SelectedFacetButton } from './SelectedFacetButton';
import { getSectorValueContent } from './facetHelpers';

interface SelectedProjectFacetButtonProps {
  param: string;
  value: string;
  aggregations?: ProjectAggregations;
}

export const SelectedProjectFacetButton = ({ param, value, aggregations }: SelectedProjectFacetButtonProps) => {
  const { t } = useTranslation();

  const paramContent = getParamContent(t, param);
  const valueContent = getValueContent(t, param, value, aggregations);

  return (
    <SelectedFacetButton
      param={param}
      value={value}
      content={
        <>
          {paramContent}: {valueContent}
        </>
      }
    />
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
    case ProjectSearchParameter.SectorFacet:
      const sectorLabels = aggregations?.sectorFacet?.find((bucket) => bucket.key === value)?.labels;
      return getSectorValueContent(t, value, sectorLabels);
    case ProjectSearchParameter.CategoryFacet:
      return '';
    case ProjectSearchParameter.HealthProjectFacet:
      return '';
    case ProjectSearchParameter.ParticipantFacet:
      return '';
    case ProjectSearchParameter.FundingSourceFacet:
      return '';
    default:
      return typeof value === 'string' ? value || t('common.unknown') : t('common.unknown');
  }
};
