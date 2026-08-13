import SearchIcon from '@mui/icons-material/Search';
import {
  AutocompleteRenderInputParams,
  CircularProgress,
  InputLabelProps,
  TextField,
  TextFieldProps,
} from '@mui/material';

type AutocompleteSlotProps = AutocompleteRenderInputParams['slotProps'];

// Autocomplete types the inputLabel slot as plain label attributes, so widen it to accept InputLabel props such as shrink
type AutocompleteTextFieldSlotProps = Omit<AutocompleteSlotProps, 'inputLabel'> & {
  inputLabel: AutocompleteSlotProps['inputLabel'] & Pick<InputLabelProps, 'shrink'>;
};

export interface AutocompleteTextFieldProps
  extends
    Omit<AutocompleteRenderInputParams, 'slotProps'>,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required' | 'name' | 'value' | 'onBlur' | 'multiline' | 'variant'> {
  slotProps: AutocompleteTextFieldSlotProps;
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
        ...params.slotProps.htmlInput,
        'aria-label': params.label ? undefined : params.placeholder,
      },
      input: {
        ...params.slotProps.input,
        startAdornment: showSearchIcon ? (
          <>
            {params.slotProps.input.startAdornment}
            {showSearchIcon && <SearchIcon color="disabled" />}
          </>
        ) : (
          params.slotProps.input.startAdornment
        ),
        endAdornment: isLoading ? (
          <>
            {isLoading && <CircularProgress size={20} aria-labelledby={params.slotProps.inputLabel.id} />}
            {params.slotProps.input.endAdornment}
          </>
        ) : (
          params.slotProps.input.endAdornment
        ),
      },
    }}
  />
);
