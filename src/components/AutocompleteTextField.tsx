import { CircularProgress, TextField, TextFieldProps, AutocompleteRenderInputParams } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required' | 'name' | 'value' | 'onBlur' | 'multiline'> {
  isLoading: boolean;
  showSearchIcon?: boolean;
  errorMessage?: string;
  dataTestId?: string;
}

export const AutocompleteTextField = ({
  isLoading,
  showSearchIcon,
  errorMessage,
  dataTestId,
  ...params
}: AutocompleteTextFieldProps) => (
  <TextField
    type="search"
    {...params}
    variant="filled"
    fullWidth
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          {params.InputProps.startAdornment}
          {showSearchIcon && <SearchIcon color="disabled" />}
        </>
      ),
      endAdornment: (
        <>
          {isLoading && <CircularProgress size={20} aria-labelledby={params.InputLabelProps.id} />}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
    error={!!errorMessage}
    helperText={errorMessage}
    data-testid={dataTestId}
  />
);
