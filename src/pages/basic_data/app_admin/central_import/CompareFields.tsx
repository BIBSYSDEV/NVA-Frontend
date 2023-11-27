import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CompareFieldsProps extends Pick<TextFieldProps, 'variant'> {
  label: string;
  onOverwrite?: () => void;
  candidateValue: string | undefined;
  registrationValue: string | undefined;
}

export const CompareFields = ({
  label,
  candidateValue,
  registrationValue,
  onOverwrite,
  variant = 'filled',
}: CompareFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        size="small"
        variant={variant}
        disabled
        multiline
        label={label}
        value={candidateValue}
        InputLabelProps={{ shrink: true }}
      />
      {onOverwrite ? (
        <IconButton
          size="small"
          color="primary"
          sx={{ bgcolor: 'white' }}
          title={t('basic_data.central_import.merge_candidate.update_value')}
          disabled={!candidateValue || candidateValue === registrationValue}
          onClick={onOverwrite}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      ) : (
        <span />
      )}
      <TextField
        size="small"
        variant={variant}
        disabled
        multiline
        label={label}
        value={registrationValue}
        InputLabelProps={{ shrink: true }}
      />
    </>
  );
};
