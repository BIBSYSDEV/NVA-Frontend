import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SortOrder } from '../api/searchApi';
import { dataTestId } from '../utils/dataTestIds';

interface SortSelectorOption {
  orderBy: string;
  sortOrder: SortOrder;
  label: string;
}

interface SortSelectorProps extends Pick<TextFieldProps, 'sx' | 'variant' | 'size' | 'label' | 'aria-label'> {
  orderKey: string;
  options: SortSelectorOption[];
  paginationKey: string;
  sortKey: string;
}

export const SortSelector = ({ orderKey, options, paginationKey, sortKey, ...textFieldProps }: SortSelectorProps) => {
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
      inputProps={{
        'aria-label': textFieldProps['aria-label'],
      }}
      onChange={(event) => {
        // These typing workarounds are needed because of the way MenuItem handle object values: https://github.com/mui/material-ui/issues/14286
        const value = event.target.value as unknown as SortSelectorOption;
        params.set(orderKey, value.orderBy);
        params.set(sortKey, value.sortOrder);
        params.delete(paginationKey);
        navigate({ search: params.toString() });
      }}>
      {options.map((option) => (
        <MenuItem key={option.label} value={option as any}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
