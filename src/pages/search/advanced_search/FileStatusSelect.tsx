import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';

enum FileStatus {
  hasPublicFiles = 'hasPublicFiles',
  noFiles = 'noFiles',
}

export const FileStatusSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedParam = searchParams.get(ResultParam.Files) ?? '';

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;

    if (newValue) {
      searchParams.set(ResultParam.Files, newValue);
    } else {
      searchParams.delete(ResultParam.Files);
      searchParams.delete(ResultParam.From);
    }
    navigate({ search: searchParams.toString() });
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
