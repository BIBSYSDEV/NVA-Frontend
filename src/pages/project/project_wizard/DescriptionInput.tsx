import { TextField } from '@mui/material';

interface DescriptionInputProps {
  field: FieldInputProps<string>;
  dataTestId: string;
  label: string;
}

const MAX_SUMMARY_LENGTH = 4000;

export const DescriptionInput = ({ field, dataTestId, label }: DescriptionInputProps) => (
  <TextField
    {...field}
    value={field.value ?? ''}
    variant="filled"
    fullWidth
    multiline
    rows="3"
    data-testid={dataTestId}
    label={label}
    slotProps={{
      htmlInput: { maxLength: MAX_SUMMARY_LENGTH },
      formHelperText: { sx: { textAlign: 'end' } },
    }}
    helperText={`${field.value?.length ?? 0}/${MAX_SUMMARY_LENGTH}`}
  />
);
