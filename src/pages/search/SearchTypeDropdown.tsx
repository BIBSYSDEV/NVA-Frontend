import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

export enum SearchTypeValue {
  Result = 'registration',
  Person = 'person',
  Project = 'project',
}

interface SearchTypeDropdownProps extends Pick<TextFieldProps, 'sx'> {
  selectedValue: SearchTypeValue;
  setSelectedSearchType: (searchType: SearchTypeValue) => void;
}

export const SearchTypeDropdown = ({ sx = {}, selectedValue, setSelectedSearchType }: SearchTypeDropdownProps) => {
  const { t } = useTranslation();
  return (
    <TextField
      select
      value={selectedValue}
      size="small"
      data-testid={dataTestId.startPage.searchTypeField}
      sx={{
        minWidth: '9rem',
        '.MuiSelect-select': {
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          bgcolor: `${selectedValue}.main`,
        },
        ...sx,
      }}
      slotProps={{ htmlInput: { 'aria-label': t('common.type') } }}
      onChange={(event) => setSelectedSearchType(event.target.value as SearchTypeValue)}>
      <MenuItem sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} value={SearchTypeValue.Result}>
        <NotesIcon fontSize="small" />
        {t('search.result')}
      </MenuItem>
      <MenuItem sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} value={SearchTypeValue.Person}>
        <PersonIcon fontSize="small" />
        {t('search.persons')}
      </MenuItem>
      <MenuItem sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} value={SearchTypeValue.Project}>
        <ShowChartIcon fontSize="small" />
        {t('project.project')}
      </MenuItem>
    </TextField>
  );
};
