import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, OutlinedTextFieldProps, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

interface SearchTextFieldProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  clearValue?: () => void;
}

export const SearchTextField = ({ clearValue, ...props }: SearchTextFieldProps) => {
  const { t } = useTranslation();
  return (
    <TextField
      {...props}
      type="search"
      data-testid={dataTestId.startPage.searchField}
      fullWidth
      variant="outlined"
      size="small"
      aria-label={t('common.search')}
      InputProps={{
        startAdornment: <SearchIcon color="disabled" />,
        endAdornment:
          props.value && clearValue ? (
            <IconButton onClick={clearValue} title={t('common.clear')} size="small">
              <ClearIcon />
            </IconButton>
          ) : null,
      }}
    />
  );
};
