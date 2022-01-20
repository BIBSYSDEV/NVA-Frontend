import { CircularProgress, TextField, TextFieldProps, AutocompleteRenderInputParams } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required'> {
  isLoading: boolean;
  showSearchIcon?: boolean;
  errorMessage?: string;
}

export const AutocompleteTextField = ({
  isLoading,
  showSearchIcon,
  errorMessage,
  ...params
}: AutocompleteTextFieldProps) => (
  <TextField
    {...params}
    variant="filled"
    fullWidth
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          {params.InputProps.startAdornment}
          {showSearchIcon && <SearchIcon color="disabled" sx={{ marginLeft: '0.5rem' }} />}
        </>
      ),
      endAdornment: (
        <>
          {isLoading && <CircularProgress size={20} />}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
    error={!!errorMessage}
    helperText={errorMessage}
  />
);
