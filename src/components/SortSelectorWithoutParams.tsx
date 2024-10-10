import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';
import { SortSelectorOption } from './SortSelector';

interface SortSelectorWithoutParamsProps<T> {
  options: T[];
  value: T;
  setValue: (value: T) => void;
}

export const SortSelectorWithoutParams = <T extends SortSelectorOption>({
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
        // These typing workarounds are needed because of the way MenuItem handle object values: https://github.com/mui/material-ui/issues/14286
        const value = event.target.value as unknown as T;
        setValue(value);
      }}>
      {options.map((option) => (
        <MenuItem key={option.i18nKey} value={option as any}>
          {t(option.i18nKey)}
        </MenuItem>
      ))}
    </TextField>
  );
};
