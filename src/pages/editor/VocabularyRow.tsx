import { ToggleButtonGroup, ToggleButton, Typography, Box, SxProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerVocabulary, VocabularyStatus } from '../../types/customerInstitution.types';
import { getTranslatedVocabularyName } from './VocabularySettings';

const toggleButtonSx: SxProps = { width: 'fit-content', px: '1rem' };

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabularies: (newVocabulary: CustomerVocabulary) => Promise<void>;
  isLoadingCustomer: boolean;
  dataTestId: string;
  disabled: boolean;
}

export const VocabularyRow = ({ vocabulary, updateVocabularies, dataTestId, disabled }: VocabularyRowProps) => {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        alignItems: 'center',
        gap: '1rem',
      }}>
      <ToggleButtonGroup
        size="small"
        data-testid={dataTestId}
        color="primary"
        disabled={disabled || isUpdating}
        value={isUpdating ? null : vocabulary.status}
        exclusive
        onChange={async (_, value) => {
          if (value) {
            setIsUpdating(true);
            await updateVocabularies({ ...vocabulary, status: value });
            setIsUpdating(false);
          }
        }}>
        <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Default}>
          {t('editor.default')}
        </ToggleButton>
        <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Allowed}>
          {t('editor.allowed')}
        </ToggleButton>
        <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Disabled}>
          {t('editor.disabled')}
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography>{getTranslatedVocabularyName(t, vocabulary.id)}</Typography>
    </Box>
  );
};
