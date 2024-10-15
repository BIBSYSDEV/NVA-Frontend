import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../../../api/searchApi';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useRegistrationsQueryParams } from '../../../../utils/hooks/useRegistrationSearchParams';
import { getFileFacetText, removeSearchParamValue, syncParamsWithSearchFields } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { PublicationYearIntervalFilter } from '../../PublicationYearIntervalFilter';
import { SearchPageProps } from '../../SearchPage';
import { useLocation, useNavigate } from 'react-router-dom';

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const registrationParams = useRegistrationsQueryParams();

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
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const currentValues = syncedParams.get(param)?.split(',') ?? [];
    if (currentValues.length === 0) {
      syncedParams.set(param, key);
    } else {
      syncedParams.set(param, [...currentValues, key].join(','));
    }
    syncedParams.set(ResultParam.From, '0');
    navigate({ search: syncedParams.toString() });
  };

  const removeFacetFilter = (param: string, key: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const newSearchParams = removeSearchParamValue(syncedParams, param, key);
    newSearchParams.set(ResultParam.From, '0');
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {typeFacet.length > 0 && (
        <FacetItem title={t('common.category')} dataTestId={dataTestId.aggregations.typeFacets}>
          {typeFacet.map((facet) => {
            const isSelected = registrationParams.category === facet.key;

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
                isSelected={isSelected}
                label={t(`registration.publication_types.${facet.key}`)}
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
        <FacetItem title={t('common.institution')} dataTestId={dataTestId.aggregations.institutionFacets}>
          {topLevelOrganizationFacet.map((facet) => {
            const isSelected = !!registrationParams.topLevelOrganization?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
          dataTestId={dataTestId.aggregations.contributorFacets}>
          {contributorFacet.map((facet) => {
            const isSelected = !!registrationParams.contributor?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
        <FacetItem title={t('common.financier')} dataTestId={dataTestId.aggregations.fundingFacets}>
          {fundingFacet.map((facet) => {
            const isSelected = !!registrationParams.fundingSource?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
        <FacetItem title={t('common.publisher')} dataTestId={dataTestId.aggregations.publisherFacets}>
          {publisherFacet.map((facet) => {
            const isSelected = !!registrationParams.publisher?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
        <FacetItem title={t('registration.resource_type.series')} dataTestId={dataTestId.aggregations.seriesFacets}>
          {seriesFacet.map((facet) => {
            const isSelected = !!registrationParams.series?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
        <FacetItem title={t('registration.resource_type.journal')} dataTestId={dataTestId.aggregations.journalFacets}>
          {journalFacet.map((facet) => {
            const isSelected = !!registrationParams.journal?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={registrationQuery.isPending}
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
          dataTestId={dataTestId.aggregations.scientificIndexFacet}>
          {scientificIndexFacet
            .sort((a, b) => +b.key - +a.key)
            .map((facet) => {
              const isSelected = !!registrationParams.scientificReportPeriodSince?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  identifier={facet.key}
                  dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                  isLoading={registrationQuery.isPending}
                  isSelected={isSelected}
                  label={facet.key}
                  count={facet.count}
                  onClickFacet={() => {
                    if (isSelected) {
                      removeFacetFilter(ResultParam.ScientificReportPeriodSinceParam, facet.key);
                    } else {
                      addFacetFilter(ResultParam.ScientificReportPeriodSinceParam, facet.key);
                      addFacetFilter(ResultParam.ScientificReportPeriodBeforeParam, (+facet.key + 1).toString());
                    }
                  }}
                />
              );
            })}
        </FacetItem>
      )}

      {filesFacet.length > 0 && (
        <FacetItem title={t('registration.files_and_license.files')} dataTestId={dataTestId.aggregations.filesFacets}>
          {filesFacet
            .sort((one) => (one.key === 'hasPublicFiles' ? -1 : 1))
            .map((facet) => {
              const isSelected = !!registrationParams.files?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  identifier={facet.key}
                  dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                  isLoading={registrationQuery.isPending}
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
        <PublicationYearIntervalFilter
          datePickerProps={{ slotProps: { textField: { size: 'small' } } }}
          boxProps={{ sx: { m: '0.5rem 1rem 1rem 1rem' } }}
        />
      </FacetItem>
    </>
  );
};
