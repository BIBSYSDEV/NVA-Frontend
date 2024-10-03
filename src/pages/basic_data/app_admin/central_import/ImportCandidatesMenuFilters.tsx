import { Box, FormControlLabel, FormGroup, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchImportCandidates,
  FetchImportCandidatesParams,
  ImportCandidatesSearchParam,
} from '../../../../api/searchApi';
import { ImportCandidateStatus } from '../../../../types/importCandidate.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useFetchImportCandidatesQuery } from '../../../../utils/hooks/useFetchImportCandidatesQuery';
import { getFileFacetText, syncParamsWithSearchFields } from '../../../../utils/searchHelpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { UrlPathTemplate } from '../../../../utils/urlPaths';
import { FacetItem } from '../../../search/FacetItem';
import { FacetListItem } from '../../../search/FacetListItem';

const thisYear = new Date().getFullYear();
const yearOptions = [thisYear, thisYear - 1, thisYear - 2, thisYear - 3, thisYear - 4, thisYear - 5];

export const ImportCandidatesMenuFilters = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const shouldFetchImportCandidates = location.pathname === UrlPathTemplate.BasicDataCentralImport;

  const { importCandidateQuery, importCandidateParams } = useFetchImportCandidatesQuery(shouldFetchImportCandidates);

  const importCandidatesFacetsParams: FetchImportCandidatesParams = {
    aggregation: 'all',
    size: 0,
    publicationYear: importCandidateParams.publicationYear,
  };
  const importCandidatesFacetsQuery = useQuery({
    enabled: shouldFetchImportCandidates,
    queryKey: ['importCandidatesFacets', importCandidatesFacetsParams],
    queryFn: () => fetchImportCandidates(importCandidatesFacetsParams),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const updateSearchParams = (param: ImportCandidatesSearchParam, value: string) => {
    const searchParams = new URLSearchParams(history.location.search);
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (syncedParams.get(param) === value) {
      syncedParams.delete(param);
    } else {
      syncedParams.set(param, value);
    }
    syncedParams.delete(ImportCandidatesSearchParam.From);
    navigate({ search: syncedParams.toString() });
  };

  const statusBuckets = importCandidatesFacetsQuery.data?.aggregations?.importStatus;
  const toImportCount = statusBuckets
    ? (statusBuckets.find((aggregation) => aggregation.key === 'NOT_IMPORTED')?.count ?? 0).toLocaleString()
    : '';
  const importedCount = statusBuckets
    ? (statusBuckets.find((aggregation) => aggregation.key === 'IMPORTED')?.count ?? 0).toLocaleString()
    : '';
  const notApplicableCount = statusBuckets
    ? (statusBuckets.find((aggregation) => aggregation.key === 'NOT_APPLICABLE')?.count ?? 0).toLocaleString()
    : '';

  const typeAggregations = importCandidateQuery.data?.aggregations?.type ?? [];
  const topLevelOrgAggregations = importCandidateQuery.data?.aggregations?.topLevelOrganization ?? [];
  const collaborationTypeAggregations = importCandidateQuery.data?.aggregations?.collaborationType ?? [];
  const filesAggregations = importCandidateQuery.data?.aggregations?.files ?? [];

  return (
    <FormGroup sx={{ mx: '1rem', mb: '1rem' }}>
      <Select
        data-testid={dataTestId.basicData.centralImport.filter.publicationYearSelect}
        size="small"
        sx={{ mt: '0.5rem' }}
        value={importCandidateParams.publicationYear}
        inputProps={{ 'aria-label': t('common.year') }}
        onChange={(event) =>
          updateSearchParams(ImportCandidatesSearchParam.PublicationYear, event.target.value.toString())
        }>
        {yearOptions.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>

      <RadioGroup
        sx={{ mt: '1rem' }}
        value={importCandidateParams.importStatus}
        onChange={(_, value) => updateSearchParams(ImportCandidatesSearchParam.ImportStatus, value)}>
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.filter.notImportedRadio}
          value={'NOT_IMPORTED' satisfies ImportCandidateStatus}
          control={<Radio />}
          label={
            toImportCount
              ? `${t('basic_data.central_import.status.NOT_IMPORTED')} (${toImportCount})`
              : t('basic_data.central_import.status.NOT_IMPORTED')
          }
        />
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.filter.importedRadio}
          value={'IMPORTED' satisfies ImportCandidateStatus}
          control={<Radio />}
          label={
            importedCount
              ? `${t('basic_data.central_import.status.IMPORTED')} (${importedCount})`
              : t('basic_data.central_import.status.IMPORTED')
          }
        />
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.filter.notApplicableRadio}
          value={'NOT_APPLICABLE' satisfies ImportCandidateStatus}
          control={<Radio />}
          label={
            notApplicableCount
              ? `${t('basic_data.central_import.status.NOT_APPLICABLE')} (${notApplicableCount})`
              : t('basic_data.central_import.status.NOT_APPLICABLE')
          }
        />
      </RadioGroup>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '0.5rem' }}>
        {typeAggregations?.length > 0 && (
          <FacetItem title={t('common.category')} dataTestId={dataTestId.aggregations.typeFacets}>
            {typeAggregations.map((facet) => (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={importCandidatesFacetsQuery.isLoading}
                isSelected={importCandidateParams.type === facet.key}
                label={t(`registration.publication_types.${facet.key}`)}
                count={facet.count}
                onClickFacet={() => updateSearchParams(ImportCandidatesSearchParam.Type, facet.key)}
              />
            ))}
          </FacetItem>
        )}

        {topLevelOrgAggregations?.length > 0 && (
          <FacetItem title={t('common.institution')} dataTestId={dataTestId.aggregations.typeFacets}>
            {topLevelOrgAggregations.map((facet) => (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={importCandidatesFacetsQuery.isLoading}
                isSelected={importCandidateParams.topLevelOrganization === facet.key}
                label={getLanguageString(facet.labels) || getIdentifierFromId(facet.key)}
                count={facet.count}
                onClickFacet={() => updateSearchParams(ImportCandidatesSearchParam.TopLevelOrganization, facet.key)}
              />
            ))}
          </FacetItem>
        )}

        {collaborationTypeAggregations?.length > 0 && (
          <FacetItem
            title={t('basic_data.central_import.collaboration_type.Collaborative')}
            dataTestId={dataTestId.aggregations.collaboardationTypeFacets}>
            {collaborationTypeAggregations.map((facet) => (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={importCandidatesFacetsQuery.isLoading}
                isSelected={importCandidateParams.collaborationType === facet.key}
                label={t(`basic_data.central_import.collaboration_type.${facet.key}`)}
                count={facet.count}
                onClickFacet={() => updateSearchParams(ImportCandidatesSearchParam.CollaborationType, facet.key)}
              />
            ))}
          </FacetItem>
        )}

        {filesAggregations?.length > 0 && (
          <FacetItem title={t('registration.files_and_license.files')} dataTestId={dataTestId.aggregations.filesFacets}>
            {filesAggregations.map((facet) => (
              <FacetListItem
                key={facet.key}
                identifier={facet.key}
                dataTestId={dataTestId.aggregations.facetItem(facet.key)}
                isLoading={importCandidatesFacetsQuery.isLoading}
                isSelected={importCandidateParams.files === facet.key}
                label={getFileFacetText(facet.key, t)}
                count={facet.count}
                onClickFacet={() => updateSearchParams(ImportCandidatesSearchParam.Files, facet.key)}
              />
            ))}
          </FacetItem>
        )}
      </Box>
    </FormGroup>
  );
};
