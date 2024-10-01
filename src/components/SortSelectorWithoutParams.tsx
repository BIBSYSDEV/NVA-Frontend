import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';

interface SortSelectorWithoutParamsProps<T> {
  options: T[];
  value: T;
  setValue: (value: T) => void;
}

export const SortSelectorWithoutParams = <T extends { label: string }>({
  value,
  setValue,
  options,
}: SortSelectorWithoutParamsProps<T>) => {
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
        const value = event.target.value as unknown as T;
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
