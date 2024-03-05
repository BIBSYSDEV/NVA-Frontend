import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../../api/searchApi';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { getFileFacetText, removeSearchParamValue } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { PublicationDateIntervalFilter } from '../../PublicationDateIntervalFilter';
import { SearchPageProps } from '../../SearchPage';

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedCategory = searchParams.get(ResultParam.Category);
  const selectedOrganization = searchParams.get(ResultParam.TopLevelOrganization);
  const selectedFunding = searchParams.get(ResultParam.FundingSource);
  const selectedContributor = searchParams.get(ResultParam.Contributor);
  const selectedPublisher = searchParams.get(ResultParam.Publisher);
  const selectedSeries = searchParams.get(ResultParam.Series);
  const selectedJournal = searchParams.get(ResultParam.Journal);
  const selectedScientificIndex = searchParams.get(ResultParam.ScientificIndex);
  const selectedFiles = searchParams.get(ResultParam.Files);

  const typeFacet = registrationQuery.data?.aggregations?.type ?? [];
  const topLevelOrganizationFacet = registrationQuery.data?.aggregations?.topLevelOrganization ?? [];
  const contributorFacet = registrationQuery.data?.aggregations?.contributor ?? [];
  const fundingFacet = registrationQuery.data?.aggregations?.fundingSource ?? [];
  const publisherFacet = registrationQuery.data?.aggregations?.publisher ?? [];
  const seriesFacet = registrationQuery.data?.aggregations?.series ?? [];
  const journalFacet = registrationQuery.data?.aggregations?.journal ?? [];
  const scientificIndexFacet = registrationQuery.data?.aggregations?.scientificIndex ?? [];
  const filesFacet = registrationQuery.data?.aggregations?.files ?? [];

  const addFacetFilter = (param: string, key: string) => {
    const currentValues = searchParams.get(param)?.split(',') ?? [];
    if (currentValues.length === 0) {
      searchParams.set(param, key);
    } else {
      searchParams.set(param, [...currentValues, key].join(','));
    }
    searchParams.set(ResultParam.From, '0');
    history.push({ search: searchParams.toString() });
  };

  const removeFacetFilter = (param: string, key: string) => {
    const newSearchParams = removeSearchParamValue(searchParams, param, key);
    newSearchParams.set(ResultParam.From, '0');
    history.push({ search: newSearchParams.toString() });
  };

  return (
    <>
      {typeFacet.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.startPage.typeFacets}>
          {typeFacet.map((facet) => {
            const registrationType = facet.key as PublicationInstanceType;
            const isSelected = selectedCategory === registrationType;

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={t(`registration.publication_types.${registrationType}`)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Category, facet.key)
                    : addFacetFilter(ResultParam.Category, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {topLevelOrganizationFacet.length > 0 && (
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.startPage.institutionFacets}>
          {topLevelOrganizationFacet.map((facet) => {
            const isSelected = !!selectedOrganization?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || getIdentifierFromId(facet.key)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.TopLevelOrganization, facet.key)
                    : addFacetFilter(ResultParam.TopLevelOrganization, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {contributorFacet.length > 0 && (
        <FacetItem
          title={t('registration.contributors.contributor')}
          dataTestId={dataTestId.startPage.contributorFacets}>
          {contributorFacet.map((facet) => {
            const isSelected = !!selectedContributor?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Contributor, facet.key)
                    : addFacetFilter(ResultParam.Contributor, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {fundingFacet.length > 0 && (
        <FacetItem title={t('common.financier')} dataTestId={dataTestId.startPage.fundingFacets}>
          {fundingFacet.map((facet) => {
            const isSelected = !!selectedFunding?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.FundingSource, facet.key)
                    : addFacetFilter(ResultParam.FundingSource, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {publisherFacet.length > 0 && (
        <FacetItem title={t('common.publisher')} dataTestId={dataTestId.startPage.publisherFacets}>
          {publisherFacet.map((facet) => {
            const isSelected = !!selectedPublisher?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || t('registration.missing_name')}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Publisher, facet.key)
                    : addFacetFilter(ResultParam.Publisher, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {seriesFacet.length > 0 && (
        <FacetItem title={t('registration.resource_type.series')} dataTestId={dataTestId.startPage.seriesFacets}>
          {seriesFacet.map((facet) => {
            const isSelected = !!selectedSeries?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || t('registration.missing_name')}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Series, facet.key)
                    : addFacetFilter(ResultParam.Series, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {journalFacet.length > 0 && (
        <FacetItem title={t('registration.resource_type.journal')} dataTestId={dataTestId.startPage.journalFacets}>
          {journalFacet.map((facet) => {
            const isSelected = !!selectedJournal?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.startPage.facetItem(facet.key)}
                isLoading={registrationQuery.isLoading}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || t('registration.missing_name')}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Journal, facet.key)
                    : addFacetFilter(ResultParam.Journal, facet.key)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {scientificIndexFacet.length > 0 && (
        <FacetItem
          title={t('basic_data.nvi.nvi_publication_year')}
          dataTestId={dataTestId.startPage.scientificIndexFacet}>
          {scientificIndexFacet
            .sort((a, b) => +b.key - +a.key)
            .map((facet) => {
              const isSelected = !!selectedScientificIndex?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  identifier={facet.key}
                  dataTestId={dataTestId.startPage.facetItem(facet.key)}
                  isLoading={registrationQuery.isLoading}
                  isSelected={isSelected}
                  label={facet.key}
                  count={facet.count}
                  onClickFacet={() =>
                    isSelected
                      ? removeFacetFilter(ResultParam.ScientificIndex, facet.key)
                      : addFacetFilter(ResultParam.ScientificIndex, facet.key)
                  }
                />
              );
            })}
        </FacetItem>
      )}

      {filesFacet.length > 0 && (
        <FacetItem title={t('registration.files_and_license.files')} dataTestId={dataTestId.startPage.filesFacets}>
          {filesFacet
            .sort((one) => (one.key === 'hasPublicFiles' ? -1 : 1))
            .map((facet) => {
              const isSelected = !!selectedFiles?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  identifier={facet.key}
                  dataTestId={dataTestId.startPage.facetItem(facet.key)}
                  isLoading={registrationQuery.isLoading}
                  isSelected={isSelected}
                  label={getFileFacetText(facet.key, t)}
                  count={facet.count}
                  onClickFacet={() =>
                    isSelected
                      ? removeFacetFilter(ResultParam.Files, facet.key)
                      : addFacetFilter(ResultParam.Files, facet.key)
                  }
                />
              );
            })}
        </FacetItem>
      )}

      <FacetItem dataTestId={dataTestId.startPage.publicationDateFilter} title={t('common.publishing_year')}>
        <PublicationDateIntervalFilter
          datePickerProps={{ slotProps: { textField: { size: 'small' } } }}
          boxProps={{ sx: { m: '0.5rem 1rem 1rem 1rem' } }}
        />
      </FacetItem>
    </>
  );
};
