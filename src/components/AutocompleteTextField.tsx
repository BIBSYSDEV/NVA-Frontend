import SearchIcon from '@mui/icons-material/Search';
import { AutocompleteRenderInputParams, CircularProgress, TextField, TextFieldProps } from '@mui/material';

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required' | 'name' | 'value' | 'onBlur' | 'multiline' | 'variant'> {
  isLoading?: boolean;
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
    type="search"
    variant="filled"
    {...params}
    fullWidth
    error={!!errorMessage}
    helperText={errorMessage}
    slotProps={{
      input: {
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
      },
    }}
  />
);
