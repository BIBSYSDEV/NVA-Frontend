import SearchIcon from '@mui/icons-material/Search';
import { AutocompleteRenderInputParams, CircularProgress, TextField, TextFieldProps } from '@mui/material';

export interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<
      TextFieldProps,
      'placeholder' | 'label' | 'required' | 'name' | 'value' | 'onBlur' | 'multiline' | 'variant' | 'slotProps'
    > {
  'data-testid'?: string;
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
      ...params.slotProps,
      htmlInput: {
        ...params.inputProps,
        'aria-label': params.label ? undefined : params.placeholder,
      },
      input: {
        ...params.InputProps,
        startAdornment: showSearchIcon ? (
          <>
            {params.InputProps.startAdornment}
            {showSearchIcon && <SearchIcon color="disabled" />}
          </>
        ) : (
          params.InputProps.startAdornment
        ),
        endAdornment: isLoading ? (
          <>
            {isLoading && <CircularProgress size={20} aria-labelledby={params.InputLabelProps.id} />}
            {params.InputProps.endAdornment}
          </>
        ) : (
          params.InputProps.endAdornment
        ),
      },
    }}
  />
);
