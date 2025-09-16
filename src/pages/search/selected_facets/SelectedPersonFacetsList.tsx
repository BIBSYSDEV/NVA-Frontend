import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { PersonAggregations } from '../../../types/user.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SelectedInstitutionFacetButton } from './button_content/SelectedInstitutionFacetButton';
import { getSelectedFacetsArray } from './facetHelpers';
import { SelectedFacetButton } from './SelectedFacetButton';
import { SelectedFacetsList } from './SelectedFacetsList';

const personFacetParams: string[] = [PersonSearchParameter.Organization, PersonSearchParameter.Sector];

interface SelectedPersonFacetsListProps {
  aggregations?: PersonAggregations;
}

export const SelectedPersonFacetsList = ({ aggregations }: SelectedPersonFacetsListProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, personFacetParams);

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
            key={`${param}${value}`}
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
    case PersonSearchParameter.Organization: {
      return t('common.institution');
    }
    case PersonSearchParameter.Sector:
      return t('search.sector');
    default:
      return param || t('common.unknown');
  }
};

const getValueContent = (t: TFunction, param: string, value: string, aggregations?: PersonAggregations) => {
  switch (param) {
    case PersonSearchParameter.Organization: {
      const institutionLabels = aggregations?.organizationFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        const institutionIdentifier = Number.isInteger(+value) ? `${value}.0.0.0` : value;
        return <SelectedInstitutionFacetButton institutionIdentifier={institutionIdentifier} />;
      }
    }
    case PersonSearchParameter.Sector:
      const sectorLabels = aggregations?.sectorFacet?.find((bucket) => bucket.key === value)?.labels;
      const sectorName = getLanguageString(sectorLabels);
      if (sectorName) {
        return sectorName;
      } else {
        if (value === 'UC') {
          return t('basic_data.institutions.sector_values.UHI');
        } else {
          return t(`basic_data.institutions.sector_values.${value}`, { defaultValue: value });
        }
      }
    default:
      return value || t('common.unknown');
  }
};
