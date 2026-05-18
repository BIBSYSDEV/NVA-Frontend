import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../../api/searchApi';
import { SearchForPublisher } from '../../../../components/SearchForPublisher';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useRegistrationsQueryParams } from '../../../../utils/hooks/useRegistrationSearchParams';
import { getFileFacetText, removeSearchParamValue, syncParamsWithSearchFields } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { PublicationYearIntervalFilter } from '../../PublicationYearIntervalFilter';
import { SearchForPersonFacetItem } from '../../facet_search_fields/SearchForContributorFacetItem';
import { SearchForFundingSourceFacetItem } from '../../facet_search_fields/SearchForFundingSourceFacetItem';
import { SearchForInstitutionFacetItem } from '../../facet_search_fields/SearchForInstitutionFacetItem';
import { SearchForSerialPublication } from '../../facet_search_fields/SearchForSerialPublication';
import { SelectCategoryFacetItem } from '../../facet_search_fields/SelectCategoryFacetItem';
import { SearchPropTypes } from '../RegistrationSearch';

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPropTypes, 'registrationQuery'>) => {
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
    if (currentValues.includes(key)) {
      return;
    } else if (currentValues.length === 0) {
      syncedParams.set(param, key);
    } else {
      syncedParams.set(param, [...currentValues, key].join(','));
    }
    syncedParams.delete(ResultParam.From);
    navigate({ search: syncedParams.toString() });
  };

  const removeFacetFilter = (param: string, key: string) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    const newSearchParams = removeSearchParamValue(syncedParams, param, key);
    newSearchParams.delete(ResultParam.From);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      {(registrationQuery.isPending || typeFacet.length > 0) && (
        <FacetItem
          title={t('common.category')}
          dataTestId={dataTestId.aggregations.typeFacets}
          isPending={registrationQuery.isPending}
          renderCustomSelect={
            !searchParams.has(ResultParam.Category) && (
              <SelectCategoryFacetItem
                onSelectCategory={(category) => addFacetFilter(ResultParam.Category, category)}
              />
            )
          }>
          {typeFacet.map((facet) => {
            const isSelected = registrationParams.category === facet.key;

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(registrationQuery.isPending || topLevelOrganizationFacet.length > 0) && (
        <FacetItem
          title={t('common.institution')}
          dataTestId={dataTestId.aggregations.institutionFacets}
          isPending={registrationQuery.isPending}
          renderCustomSelect={
            <SearchForInstitutionFacetItem
              onSelectInstitution={(id) => addFacetFilter(ResultParam.TopLevelOrganization, getIdentifierFromId(id))}
            />
          }>
          {topLevelOrganizationFacet.map((facet) => {
            const institutionIdentifier = getIdentifierFromId(facet.key);
            const isSelected = !!registrationParams.topLevelOrganization?.includes(institutionIdentifier);

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(institutionIdentifier)}
                isSelected={isSelected}
                label={getLanguageString(facet.labels) || institutionIdentifier}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.TopLevelOrganization, institutionIdentifier)
                    : addFacetFilter(ResultParam.TopLevelOrganization, institutionIdentifier)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {(registrationQuery.isPending || contributorFacet.length > 0) && (
        <FacetItem
          title={t('registration.contributors.contributor')}
          dataTestId={dataTestId.aggregations.contributorFacets}
          isPending={registrationQuery.isPending}
          renderCustomSelect={
            <SearchForPersonFacetItem
              onSelectPerson={(identifier) => addFacetFilter(ResultParam.Contributor, identifier)}
            />
          }>
          {contributorFacet.map((facet) => {
            const contributorIdentifier = getIdentifierFromId(facet.key);
            const isSelected = !!registrationParams.contributor?.includes(contributorIdentifier);

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(contributorIdentifier)}
                isSelected={isSelected}
                label={getLanguageString(facet.labels)}
                count={facet.count}
                onClickFacet={() =>
                  isSelected
                    ? removeFacetFilter(ResultParam.Contributor, contributorIdentifier)
                    : addFacetFilter(ResultParam.Contributor, contributorIdentifier)
                }
              />
            );
          })}
        </FacetItem>
      )}

      {registrationQuery.isPending ||
        (fundingFacet.length > 0 && (
          <FacetItem
            title={t('common.financier')}
            dataTestId={dataTestId.aggregations.fundingFacets}
            isPending={registrationQuery.isPending}
            renderCustomSelect={
              <SearchForFundingSourceFacetItem
                onSelectFunder={(identifier) => addFacetFilter(ResultParam.FundingSource, identifier)}
              />
            }>
            {fundingFacet.map((facet) => {
              const isSelected = !!registrationParams.fundingSource?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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
        ))}

      {(registrationQuery.isPending || publisherFacet.length > 0) && (
        <FacetItem
          title={t('common.publisher')}
          dataTestId={dataTestId.aggregations.publisherFacets}
          renderCustomSelect={
            !searchParams.has(ResultParam.Publisher) && (
              <SearchForPublisher
                onSelectPublisher={(publisher) => {
                  if (publisher) {
                    addFacetFilter(ResultParam.Publisher, publisher.identifier);
                  }
                }}
                autocompleteProps={{
                  value: null,
                  size: 'small',
                  sx: { p: '0.25rem 0.5rem' },
                }}
                textFieldProps={{ 'data-testid': dataTestId.aggregations.publisherFacetsSearchField }}
              />
            )
          }
          isPending={registrationQuery.isPending}>
          {publisherFacet.map((facet) => {
            const isSelected = !!registrationParams.publisher?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(registrationQuery.isPending || seriesFacet.length > 0) && (
        <FacetItem
          title={t('registration.resource_type.series')}
          dataTestId={dataTestId.aggregations.seriesFacets}
          renderCustomSelect={
            !searchParams.has(ResultParam.Series) && (
              <SearchForSerialPublication
                searchMode="series"
                onSelectSerialPublication={(series) => {
                  if (series) {
                    addFacetFilter(ResultParam.Series, series.identifier);
                  }
                }}
                autocompleteProps={{
                  value: null,
                  size: 'small',
                  sx: { p: '0.25rem 0.5rem' },
                }}
                textFieldProps={{ 'data-testid': dataTestId.aggregations.seriesFacetsSearchField }}
              />
            )
          }
          isPending={registrationQuery.isPending}>
          {seriesFacet.map((facet) => {
            const isSelected = !!registrationParams.series?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(registrationQuery.isPending || journalFacet.length > 0) && (
        <FacetItem
          title={t('registration.resource_type.journal')}
          dataTestId={dataTestId.aggregations.journalFacets}
          renderCustomSelect={
            !searchParams.has(ResultParam.Journal) && (
              <SearchForSerialPublication
                searchMode="journal"
                onSelectSerialPublication={(journal) => {
                  if (journal) {
                    addFacetFilter(ResultParam.Journal, journal.identifier);
                  }
                }}
                autocompleteProps={{
                  value: null,
                  size: 'small',
                  sx: { p: '0.25rem 0.5rem' },
                }}
                textFieldProps={{ 'data-testid': dataTestId.aggregations.journalFacetsSearchField }}
              />
            )
          }
          isPending={registrationQuery.isPending}>
          {journalFacet.map((facet) => {
            const isSelected = !!registrationParams.journal?.includes(facet.key);

            return (
              <FacetListItem
                key={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(registrationQuery.isPending || scientificIndexFacet.length > 0) && (
        <FacetItem
          title={t('basic_data.nvi.nvi_publication_year')}
          dataTestId={dataTestId.aggregations.scientificIndexFacet}
          isPending={registrationQuery.isPending}>
          {scientificIndexFacet
            .sort((a, b) => +b.key - +a.key)
            .map((facet) => {
              const isSelected = !!registrationParams.scientificReportPeriodSince?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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

      {(registrationQuery.isPending || filesFacet.length > 0) && (
        <FacetItem
          title={t('registration.files_and_license.files')}
          dataTestId={dataTestId.aggregations.filesFacets}
          isPending={registrationQuery.isPending}>
          {filesFacet
            .sort((one) => (one.key === 'hasPublicFiles' ? -1 : 1))
            .map((facet) => {
              const isSelected = !!registrationParams.files?.includes(facet.key);

              return (
                <FacetListItem
                  key={facet.key}
                  dataTestId={dataTestId.aggregations.facetItem(facet.key)}
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
