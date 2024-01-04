import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../../api/searchApi';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { removeSearchParamValue } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { FacetItem } from '../../FacetItem';
import { FacetListItem } from '../../FacetListItem';
import { SearchPageProps } from '../../SearchPage';

export const RegistrationFacetsFilter = ({ registrationQuery }: Pick<SearchPageProps, 'registrationQuery'>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedCategory = searchParams.get(ResultParam.Category);
  const selectedOrganization = searchParams.get(ResultParam.TopLevelOrganization);
  const selectedFunding = searchParams.get(ResultParam.FundingSource);
  const selectedContributor = searchParams.get(ResultParam.Contributor);
  const selectedYearAfter = searchParams.get(ResultParam.PublicationYearAfter);
  const selectedYearBefore = searchParams.get(ResultParam.PublicationYearBefore);

  const selectedYearAfterDate = selectedYearAfter ? new Date(selectedYearAfter) : null;
  const selectedYearBeforeDate = selectedYearBefore ? new Date(selectedYearBefore) : null;

  const typeFacet = registrationQuery.data?.aggregations?.type;
  const topLevelOrganizationFacet = registrationQuery.data?.aggregations?.topLevelOrganization;
  const contributorFacet = registrationQuery.data?.aggregations?.contributor;
  const fundingFacet = registrationQuery.data?.aggregations?.fundingSource;

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
      {typeFacet && typeFacet.length > 0 && (
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

      {topLevelOrganizationFacet && topLevelOrganizationFacet.length > 0 && (
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

      {contributorFacet && contributorFacet.length > 0 && (
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

      {fundingFacet && fundingFacet.length > 0 && (
        <FacetItem title={t('common.funding')} dataTestId={dataTestId.startPage.institutionFacets}>
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

      <FacetItem dataTestId={dataTestId.startPage.publicationDateFilter} title={t('common.publishing_year')}>
        <Box sx={{ m: '0.5rem 1rem 1rem 1rem', display: 'flex', justifyContent: 'space-evenly', gap: '1rem' }}>
          <DatePicker
            views={['year']}
            label={t('search.year_from')}
            defaultValue={selectedYearAfter ? new Date(selectedYearAfter) : null}
            maxDate={
              selectedYearBeforeDate
                ? new Date(selectedYearBeforeDate.getFullYear(), 11, 31, 23, 59, 59, 999)
                : new Date()
            }
            disableHighlightToday
            slotProps={{ textField: { size: 'small' } }}
            onChange={(date) => {
              if (date) {
                const year = (date as Date).getFullYear();
                searchParams.set(ResultParam.PublicationYearAfter, year.toString());
                history.push({ search: searchParams.toString() });
              } else {
                searchParams.delete(ResultParam.PublicationYearAfter);
                history.push({ search: searchParams.toString() });
              }
            }}
          />
          <DatePicker
            views={['year']}
            label={t('search.year_to')}
            defaultValue={selectedYearBefore ? new Date(selectedYearBefore) : null}
            minDate={selectedYearAfterDate}
            maxDate={new Date()}
            disableHighlightToday
            slotProps={{ textField: { size: 'small' } }}
            onChange={(date) => {
              if (date) {
                const year = (date as Date).getFullYear();
                searchParams.set(ResultParam.PublicationYearBefore, year.toString());
                history.push({ search: searchParams.toString() });
              } else {
                searchParams.delete(ResultParam.PublicationYearBefore);
                history.push({ search: searchParams.toString() });
              }
            }}
          />
        </Box>
      </FacetItem>
    </>
  );
};
