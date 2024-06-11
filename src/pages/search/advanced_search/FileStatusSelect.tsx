import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';

enum FileStatus {
  hasPublicFiles = 'hasPublicFiles',
  noFiles = 'noFiles',
  showAll = 'showAll',
}

export const FileStatusSelect = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedParam = searchParams.get(ResultParam.Files) ?? FileStatus.showAll;
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;

    if (newValue !== FileStatus.showAll) {
      searchParams.set(ResultParam.Files, newValue);
    } else {
      searchParams.delete(ResultParam.Files);
      searchParams.delete(ResultParam.From);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Select
      sx={{ minWidth: '10rem' }}
      size="small"
      role="combobox"
      data-testid={dataTestId.startPage.advancedSearch.fileStatusSelect}
      SelectDisplayProps={{ 'aria-labelledby': 'file-status-select-label' }}
      aria-expanded={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      defaultValue={FileStatus.showAll}
      value={selectedParam}
      onChange={handleChange}>
      <MenuItem value={FileStatus.showAll}>{t('common.show_all')}</MenuItem>
      <MenuItem value={FileStatus.noFiles}>{t('registration.files_and_license.registration_without_file')}</MenuItem>
      <MenuItem value={FileStatus.hasPublicFiles}>
        {t('registration.files_and_license.registration_with_file')}
      </MenuItem>
    </Select>
  );
};
