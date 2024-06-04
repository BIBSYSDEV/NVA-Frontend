import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface CompareFieldsProps extends Pick<TextFieldProps, 'variant'> {
  candidateLabel?: string;
  registrationLabel?: string;
  onOverwrite?: () => void;
  candidateValue?: string;
  registrationValue?: string;
  renderCandidateValue?: ReactNode;
  renderRegistrationValue?: ReactNode;
}

export const CompareFields = ({
  candidateLabel,
  registrationLabel = candidateLabel,
  candidateValue,
  registrationValue,
  renderCandidateValue,
  renderRegistrationValue,
  onOverwrite,
  variant = 'filled',
}: CompareFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {renderCandidateValue ?? (
        <TextField
          size="small"
          variant={variant}
          disabled
          multiline
          label={candidateLabel}
          value={candidateValue}
          InputLabelProps={{ shrink: true }}
        />
      )}
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
      {renderRegistrationValue ?? (
        <TextField
          size="small"
          variant={variant}
          disabled
          multiline
          label={registrationLabel}
          value={registrationValue}
          InputLabelProps={{ shrink: true }}
        />
      )}
    </>
  );
};
