import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ImportCandidatesSearchParam } from '../../../api/searchApi';
import { CollaborationType, ImportCandidateAggregations } from '../../../types/importCandidate.types';
import { AggregationFileKeyType, PublicationInstanceType } from '../../../types/registration.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getFileFacetText } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SelectedInstitutionFacetButton } from '../registration_search/RegistrationSearchBar';
import { getSelectedFacetsArray } from './facetHelpers';
import { SelectedFacetButton } from './SelectedFacetButton';
import { SelectedFacetsList } from './SelectedFacetsList';

const importCandidateFacetParams: string[] = [
  ImportCandidatesSearchParam.Type,
  ImportCandidatesSearchParam.TopLevelOrganization,
  ImportCandidatesSearchParam.CollaborationType,
  ImportCandidatesSearchParam.Files,
];

interface SelectedImportCandidateFacetsListProps {
  aggregations?: ImportCandidateAggregations;
}

export const SelectedImportCandidateFacetsList = ({ aggregations }: SelectedImportCandidateFacetsListProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, importCandidateFacetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <SelectedFacetsList>
      {selectedFacets.map(({ param, value }) => {
        const paramContent = getParamContent(t, param);
        const valueContent = getValueContent(t, param, value, aggregations);

        const buttonContent =
          typeof valueContent === 'string' ? (
            [paramContent, valueContent].filter(Boolean).join(': ')
          ) : (
            <>
              {paramContent}: {valueContent}
            </>
          );

        return <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} content={buttonContent} />;
      })}
    </SelectedFacetsList>
  );
};

const getParamContent = (t: TFunction, param: string) => {
  switch (param) {
    case ImportCandidatesSearchParam.Type:
      return t('common.category');
    case ImportCandidatesSearchParam.TopLevelOrganization:
      return t('common.institution');
    case ImportCandidatesSearchParam.CollaborationType:
      return '';
    case ImportCandidatesSearchParam.Files:
      return '';
    default:
      return param || t('common.unknown');
  }
};

const getValueContent = (t: TFunction, param: string, value: string, aggregations?: ImportCandidateAggregations) => {
  switch (param) {
    case ImportCandidatesSearchParam.Type: {
      const categoryName = t(`registration.publication_types.${value as PublicationInstanceType}`);
      return categoryName;
    }
    case ImportCandidatesSearchParam.TopLevelOrganization: {
      const institutionLabels = aggregations?.topLevelOrganization?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        return <SelectedInstitutionFacetButton institutionIdentifier={getIdentifierFromId(value)} />;
      }
    }
    case ImportCandidatesSearchParam.CollaborationType: {
      return t(`basic_data.central_import.collaboration_type.${value as CollaborationType}`);
    }
    case ImportCandidatesSearchParam.Files: {
      return getFileFacetText(value as AggregationFileKeyType, t);
    }
    default:
      return value || t('common.unknown');
  }
};
