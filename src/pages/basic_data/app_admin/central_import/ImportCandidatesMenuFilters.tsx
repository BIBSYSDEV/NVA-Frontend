import { FormControlLabel, FormGroup, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  FetchImportCandidatesParams,
  ImportCandidatesSearchParam,
  fetchImportCandidates,
} from '../../../../api/searchApi';
import { ImportCandidateStatus } from '../../../../types/importCandidate.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useImportCandidatesParams } from '../../../../utils/hooks/useImportCandidatesParams';
import { UrlPathTemplate } from '../../../../utils/urlPaths';

const thisYear = new Date().getFullYear();
const yearOptions = [thisYear, thisYear - 1, thisYear - 2, thisYear - 3, thisYear - 4, thisYear - 5];

export const ImportCandidatesMenuFilters = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const { importStatusParam, publicationYearParam, fromParam } = useImportCandidatesParams();
  const publicationYear = publicationYearParam ?? thisYear;
  const importStatus = importStatusParam ?? 'NOT_IMPORTED';

  const importCandidatesFacetsParams: FetchImportCandidatesParams = {
    aggregation: 'all',
    size: 0,
    publicationYear,
  };
  const importCandidatesFacetsQuery = useQuery({
    enabled: history.location.pathname === UrlPathTemplate.BasicDataCentralImport,
    queryKey: ['importCandidatesFacets', importCandidatesFacetsParams],
    queryFn: () => fetchImportCandidates(importCandidatesFacetsParams),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const resetPagination = () => {
    if (fromParam) {
      searchParams.set(ImportCandidatesSearchParam.From, '0');
    }
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

  return (
    <FormGroup sx={{ mx: '1rem' }}>
      <Select
        size="small"
        sx={{ mt: '0.5rem' }}
        value={publicationYear}
        inputProps={{ 'aria-label': t('common.year') }}
        onChange={(event) => {
          searchParams.set(ImportCandidatesSearchParam.PublicationYear, event.target.value.toString());
          resetPagination();
          history.push({ search: searchParams.toString() });
        }}>
        {yearOptions.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>

      <RadioGroup
        sx={{ mt: '1rem' }}
        value={importStatus}
        onChange={(_, value) => {
          searchParams.set(ImportCandidatesSearchParam.ImportStatus, value);
          resetPagination();
          history.push({ search: searchParams.toString() });
        }}>
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
    </FormGroup>
  );
};
