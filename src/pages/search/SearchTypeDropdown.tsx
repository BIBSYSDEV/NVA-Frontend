import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { MenuItem, styled, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

const StyledMenuItem = styled(MenuItem)({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

export enum SearchTypeValue {
  Result = 'registration',
  Person = 'person',
  Project = 'project',
}

interface SearchTypeDropdownProps extends Pick<TextFieldProps, 'sx'> {
  selectedValue: SearchTypeValue;
  onSearchTypeChanged: (searchType: SearchTypeValue) => void;
}

export const SearchTypeDropdown = ({ sx = {}, selectedValue, onSearchTypeChanged }: SearchTypeDropdownProps) => {
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
      onChange={(event) => onSearchTypeChanged(event.target.value as SearchTypeValue)}>
      <StyledMenuItem value={SearchTypeValue.Result}>
        <NotesIcon fontSize="small" />
        {t('search.result')}
      </StyledMenuItem>
      <StyledMenuItem value={SearchTypeValue.Person}>
        <PersonIcon fontSize="small" />
        {t('search.persons')}
      </StyledMenuItem>
      <StyledMenuItem value={SearchTypeValue.Project}>
        <ShowChartIcon fontSize="small" />
        {t('project.project')}
      </StyledMenuItem>
    </TextField>
  );
};
