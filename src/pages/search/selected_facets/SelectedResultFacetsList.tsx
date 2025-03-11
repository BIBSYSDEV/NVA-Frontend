import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import {
  AggregationFileKeyType,
  PublicationInstanceType,
  RegistrationAggregations,
} from '../../../types/registration.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getFileFacetText } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import {
  SelectedContributorFacetButton,
  SelectedFundingFacetButton,
  SelectedInstitutionFacetButton,
  SelectedJournalFacetButton,
  SelectedPublisherFacetButton,
  SelectedSeriesFacetButton,
} from '../registration_search/RegistrationSearchBar';
import { getSelectedFacetsArray } from './facetHelpers';
import { SelectedFacetButton } from './SelectedFacetButton';
import { SelectedFacetsList } from './SelectedFacetsList';

const resultFacetParams: string[] = [
  ResultParam.Category,
  ResultParam.Contributor,
  ResultParam.Journal,
  ResultParam.Publisher,
  ResultParam.Files,
  ResultParam.FundingSource,
  ResultParam.ScientificReportPeriodSinceParam,
  ResultParam.Series,
  ResultParam.TopLevelOrganization,
  // TODO: add date param
];

interface SelectedResultFacetsListProps {
  aggregations?: RegistrationAggregations;
}

export const SelectedResultFacetsList = ({ aggregations }: SelectedResultFacetsListProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedFacets = getSelectedFacetsArray(searchParams, resultFacetParams);

  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <SelectedFacetsList>
      {selectedFacets.map(({ param, value }) => {
        const paramContent = getParamContent(t, param);
        const valueContent = getValueContent(t, param, value, aggregations);

        const content =
          typeof valueContent === 'string' ? (
            [paramContent, valueContent].filter(Boolean).join(': ')
          ) : (
            <>
              {paramContent}: {valueContent}
            </>
          );

        return <SelectedFacetButton key={`${param}-${value}`} param={param} value={value} content={content} />;
      })}
    </SelectedFacetsList>
  );
};

const getParamContent = (t: TFunction, param: string) => {
  switch (param) {
    case ResultParam.Category:
      return t('common.category');
    case ResultParam.Contributor:
      return t('registration.contributors.contributor');
    case ResultParam.Journal:
      return t('registration.resource_type.journal');
    case ResultParam.Publisher:
      return t('common.publisher');
    case ResultParam.Files:
      return '';
    case ResultParam.FundingSource:
      return t('common.financier');
    case ResultParam.ScientificReportPeriodSinceParam:
      return t('basic_data.nvi.nvi_publication_year');
    case ResultParam.Series:
      return t('registration.resource_type.series');
    case ResultParam.TopLevelOrganization:
      return t('common.institution');
    default:
      return param || t('common.unknown');
  }
};

const getValueContent = (t: TFunction, param: string, value: string, aggregations?: RegistrationAggregations) => {
  switch (param) {
    case ResultParam.Category:
      return t(`registration.publication_types.${value as PublicationInstanceType}`);
    case ResultParam.Contributor: {
      const personName = aggregations?.contributor?.find((bucket) => getIdentifierFromId(bucket.key) === value)?.labels;
      if (personName) {
        return getLanguageString(personName);
      } else {
        return <SelectedContributorFacetButton personIdentifier={value} />;
      }
    }
    case ResultParam.TopLevelOrganization: {
      const institutionLabels = aggregations?.topLevelOrganization?.find(
        (bucket) => getIdentifierFromId(bucket.key) === value
      )?.labels;

      const institutionName = institutionLabels ? getLanguageString(institutionLabels) : '';
      if (institutionName) {
        return institutionName;
      } else {
        return <SelectedInstitutionFacetButton institutionIdentifier={value} />;
      }
    }
    case ResultParam.FundingSource: {
      const fundingLabels = aggregations?.fundingSource?.find((bucket) => bucket.key === value)?.labels;
      const fundingName = fundingLabels ? getLanguageString(fundingLabels) : '';
      if (fundingName) {
        return fundingName;
      } else {
        return <SelectedFundingFacetButton fundingIdentifier={typeof value === 'string' ? value : value[0]} />;
      }
    }
    case ResultParam.Publisher: {
      const publisherLabels = aggregations?.publisher?.find((bucket) => bucket.key === value)?.labels;
      const publisherName = publisherLabels ? getLanguageString(publisherLabels) : '';
      if (publisherName) {
        return publisherName;
      } else {
        return <SelectedPublisherFacetButton publisherIdentifier={typeof value === 'string' ? value : value[0]} />;
      }
    }
    case ResultParam.Series: {
      const seriesLabels = aggregations?.series?.find((bucket) => bucket.key === value)?.labels;
      const seriesName = seriesLabels ? getLanguageString(seriesLabels) : '';
      if (seriesName) {
        return seriesName;
      } else {
        return <SelectedSeriesFacetButton seriesIdentifier={typeof value === 'string' ? value : value[0]} />;
      }
    }
    case ResultParam.Journal: {
      const journalLabels = aggregations?.journal?.find((bucket) => bucket.key === value)?.labels;
      const journalName = journalLabels ? getLanguageString(journalLabels) : '';
      if (journalName) {
        return journalName;
      } else {
        return <SelectedJournalFacetButton journalIdentifier={typeof value === 'string' ? value : value[0]} />;
      }
    }
    case ResultParam.ScientificReportPeriodSinceParam: {
      return value;
    }
    case ResultParam.Files: {
      return getFileFacetText(value as AggregationFileKeyType, t);
    }
    default:
      return value || t('common.unknown');
  }
};
