import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';

enum FileStatses {
  hasPublicFiles = 'hasPublicFiles',
  noFiles = 'noFiles',
}

export const FilesStatusSelect = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedParam = searchParams.get(ResultParam.Files) ?? '';

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;

    if (newValue !== '') {
      searchParams.set(ResultParam.Files, newValue);
      history.push({ search: searchParams.toString() });
    } else {
      searchParams.delete(ResultParam.Files);
      history.push({ search: searchParams.toString() });
    }
  };

  return (
    <FormControl sx={{ minWidth: '8rem' }} size="small">
      <InputLabel>{t('registration.files_and_license.files')}</InputLabel>
      <Select value={selectedParam} label={t('registration.files_and_license.files')} onChange={handleChange}>
        <MenuItem value="">
          <em>{t('common.select')}</em>
        </MenuItem>
        <MenuItem value={FileStatses.noFiles}>{t('search.no_files')}</MenuItem>
        <MenuItem value={FileStatses.hasPublicFiles}>{t('search.has_files')}</MenuItem>
      </Select>
    </FormControl>
  );
};
