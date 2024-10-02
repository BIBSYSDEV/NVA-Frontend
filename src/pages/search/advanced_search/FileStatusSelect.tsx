import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

enum FileStatus {
  hasPublicFiles = 'hasPublicFiles',
  noFiles = 'noFiles',
}

export const FileStatusSelect = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedParam = searchParams.get(ResultParam.Files) ?? '';

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    const syncedParams = syncParamsWithSearchFields(searchParams);

    if (newValue) {
      syncedParams.set(ResultParam.Files, newValue);
    } else {
      syncedParams.delete(ResultParam.Files);
    }
    syncedParams.delete(ResultParam.From);
    history.push({ search: syncedParams.toString() });
  };

  return (
    <Select
      sx={{ minWidth: '10rem' }}
      size="small"
      data-testid={dataTestId.startPage.advancedSearch.fileStatusSelect}
      labelId="file-status-select-label"
      value={selectedParam}
      displayEmpty
      onChange={handleChange}>
      <MenuItem value={''}>{t('common.show_all')}</MenuItem>
      <MenuItem value={FileStatus.noFiles}>{t('registration.files_and_license.registration_without_file')}</MenuItem>
      <MenuItem value={FileStatus.hasPublicFiles}>
        {t('registration.files_and_license.registration_with_file')}
      </MenuItem>
    </Select>
  );
};
