import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { SortOrder } from '../api/searchApi';
import { dataTestId } from '../utils/dataTestIds';

export interface SortSelectorOption {
  orderBy: string;
  sortOrder: SortOrder;
  i18nKey: ParseKeys;
}

interface SortSelectorProps extends Pick<TextFieldProps, 'sx' | 'variant' | 'size' | 'label' | 'aria-label'> {
  orderKey: string;
  options: SortSelectorOption[];
  paginationKey: string;
  sortKey: string;
}

export const SortSelector = ({ orderKey, options, paginationKey, sortKey, ...textFieldProps }: SortSelectorProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const orderBy = params.get(orderKey);
  const sortOrder = params.get(sortKey);

  const selectedOption =
    options.find((option) => orderBy === option.orderBy && sortOrder === option.sortOrder) ?? options[0];

  return (
    <TextField
      {...textFieldProps}
      data-testid={dataTestId.startPage.orderBySelect}
      select
      value={selectedOption}
      onChange={(event) => {
        // These typing workarounds are needed because of the way MenuItem handle object values: https://github.com/mui/material-ui/issues/14286
        const value = event.target.value as unknown as SortSelectorOption;
        params.set(orderKey, value.orderBy);
        params.set(sortKey, value.sortOrder);
        params.delete(paginationKey);
        navigate({ search: params.toString() });
      }}
      slotProps={{ htmlInput: { 'aria-label': textFieldProps['aria-label'] } }}>
      {options.map((option) => (
        <MenuItem key={option.i18nKey} value={option as any}>
          {t(option.i18nKey)}
        </MenuItem>
      ))}
    </TextField>
  );
};
