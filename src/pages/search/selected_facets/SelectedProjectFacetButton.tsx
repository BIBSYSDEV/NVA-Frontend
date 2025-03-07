import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { ProjectAggregations } from '../../../types/project.types';
import { SelectedFacetButton } from './SelectedFacetButton';

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
    case ProjectSearchParameter.CoordinatingFacet:
      return '';
    case ProjectSearchParameter.ResponsibleFacet:
      return '';
    case ProjectSearchParameter.ParticipantOrgFacet:
      return '';
    case ProjectSearchParameter.SectorFacet:
      return '';
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
