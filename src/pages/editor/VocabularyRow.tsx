import { Box, SxProps, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerVocabulary, VocabularyStatus } from '../../types/customerInstitution.types';
import { dataTestId as dataTestIds } from '../../utils/dataTestIds';
import { getTranslatedVocabularyName } from './VocabularyOverview';

const toggleButtonSx: SxProps = { width: 'fit-content', px: '1rem' };

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabularies: (newVocabulary: CustomerVocabulary) => Promise<void>;
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
        <ToggleButton
          sx={toggleButtonSx}
          value={VocabularyStatus.Default}
          data-testid={dataTestIds.editor.vocabularyDefault}>
          {t('editor.vocabulary_status.Default')}
        </ToggleButton>
        <ToggleButton
          sx={toggleButtonSx}
          value={VocabularyStatus.Allowed}
          data-testid={dataTestIds.editor.vocabularyAllowed}>
          {t('editor.vocabulary_status.Allowed')}
        </ToggleButton>
        <ToggleButton
          sx={toggleButtonSx}
          value={VocabularyStatus.Disabled}
          data-testid={dataTestIds.editor.vocabularyDisabled}>
          {t('editor.vocabulary_status.Disabled')}
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography>{getTranslatedVocabularyName(t, vocabulary.id)}</Typography>
    </Box>
  );
};
