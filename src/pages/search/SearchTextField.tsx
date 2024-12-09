import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, OutlinedTextFieldProps, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId as dataTestIdFile } from '../../utils/dataTestIds';

interface SearchTextFieldProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  clearValue?: () => void;
  dataTestId?: string;
}

export const SearchTextField = ({ clearValue, dataTestId, ...props }: SearchTextFieldProps) => {
  const { t } = useTranslation();
  return (
    <>
      <TextField
        {...props}
        type="search"
        data-testid={dataTestId ?? dataTestIdFile.startPage.searchField}
        fullWidth
        variant="outlined"
        size="small"
        aria-label={t('common.search')}
        slotProps={{
          input: {
            startAdornment: <SearchIcon color="disabled" />,
            endAdornment:
              props.value && clearValue ? (
                <IconButton onClick={clearValue} title={t('common.clear')} size="small">
                  <ClearIcon />
                </IconButton>
              ) : null,
          },
        }}
      />
      <input type="submit" hidden />
    </>
  );
};
