import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SortSelectorOption } from '../pages/search/registration_search/RegistrationSortSelector';
import { dataTestId } from '../utils/dataTestIds';

interface SortSelectorWithoutParamsProps {
  options: SortSelectorOption[];
  value: SortSelectorOption;
  setValue: (value: SortSelectorOption) => void;
}

export const SortSelectorWithoutParams = ({ value, setValue, options }: SortSelectorWithoutParamsProps) => {
  const { t } = useTranslation();

  return (
    <TextField
      data-testid={dataTestId.startPage.orderBySelect}
      select
      value={value}
      inputProps={{ 'aria-label': t('search.sort_by') }}
      size="small"
      variant="standard"
      onChange={(event) => {
        const value = event.target.value as unknown as SortSelectorOption;
        setValue(value);
      }}>
      {options.map((option) => (
        <MenuItem key={option.label} value={option as any}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
