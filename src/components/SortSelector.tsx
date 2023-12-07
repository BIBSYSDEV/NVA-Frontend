import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SortOrder } from '../api/searchApi';
import { dataTestId } from '../utils/dataTestIds';

interface SortSelectorOption {
  orderBy: string;
  sortOrder: SortOrder;
  label: string;
}

interface SortSelectorProps extends Pick<TextFieldProps, 'sx'> {
  options: SortSelectorOption[];
  sortKey: string;
  orderKey: string;
}

export const SortSelector = ({ options, sortKey, orderKey, sx }: SortSelectorProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const params = new URLSearchParams(history.location.search);

  const orderBy = params.get(orderKey);
  const sortOrder = params.get(sortKey);

  const selectedOption =
    options.find((option) => orderBy === option.orderBy && sortOrder === option.sortOrder) ?? options[0];

  return (
    <TextField
      sx={sx}
      data-testid={dataTestId.startPage.orderBySelect}
      select
      value={selectedOption}
      label={t('search.sort_by')}
      variant="outlined"
      onChange={(event) => {
        // These typing workarounds are needed because of the way MenuItem handle object values: https://github.com/mui/material-ui/issues/14286
        const value = event.target.value as unknown as SortSelectorOption;
        params.set(orderKey, value.orderBy);
        params.set(sortKey, value.sortOrder);
        history.push({ search: params.toString() });
      }}>
      {options.map((option) => (
        <MenuItem key={option.label} value={option as any}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
