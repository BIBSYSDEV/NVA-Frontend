import { ToggleButtonGroup, ToggleButton, Typography, Box, SxProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CustomerVocabulary, VocabularyStatus } from '../../types/customerInstitution.types';
import { getTranslatedVocabularyName } from './VocabularySettings';

const StyledButtonRow = styled.div`
  display: flex;
  align-items: center;

  div:first-child {
    margin-right: 1rem;
  }
`;

const toggleButtonSx: SxProps = { width: '6rem' };

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabularies: (newVocabulary: CustomerVocabulary) => Promise<void>;
  isLoadingCustomer: boolean;
  dataTestId: string;
  disabled: boolean;
}

export const VocabularyRow = ({ vocabulary, updateVocabularies, dataTestId, disabled }: VocabularyRowProps) => {
  const { t } = useTranslation('editor');
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <StyledButtonRow>
        <ToggleButtonGroup
          size="small"
          data-testid={dataTestId}
          color="primary"
          disabled={disabled || isUpdating}
          value={isUpdating ? null : vocabulary.status}
          exclusive
          onChange={async (event, value) => {
            if (value) {
              setIsUpdating(true);
              await updateVocabularies({ ...vocabulary, status: value });
              setIsUpdating(false);
            }
          }}>
          <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Default}>
            {t('default')}
          </ToggleButton>
          <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Allowed}>
            {t('allowed')}
          </ToggleButton>
          <ToggleButton sx={toggleButtonSx} value={VocabularyStatus.Disabled}>
            {t('disabled')}
          </ToggleButton>
        </ToggleButtonGroup>
      </StyledButtonRow>
      <Typography>{getTranslatedVocabularyName(t, vocabulary.id)}</Typography>
    </Box>
  );
};
