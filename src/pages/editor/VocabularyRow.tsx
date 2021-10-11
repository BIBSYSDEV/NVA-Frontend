import { ToggleButtonGroup, ToggleButton, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CustomerVocabulary, VocabularyStatus } from '../../types/customerInstitution.types';
import { getTranslatedVocabularyName } from './EditorPage';

const StyledVocabularyRow = styled.div`
  margin-top: 1rem;
`;

const StyledButtonRow = styled.div`
  display: flex;
  align-items: center;

  div:first-child {
    margin-right: 1rem;
  }
`;

interface VocabularyRowProps {
  vocabulary: CustomerVocabulary;
  updateVocabularies: (newVocabulary: CustomerVocabulary) => Promise<void>;
  isLoadingCustomer: boolean;
}

export const VocabularyRow = ({ vocabulary, updateVocabularies }: VocabularyRowProps) => {
  const { t } = useTranslation('editor');
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <StyledVocabularyRow>
      <Typography variant="h3" gutterBottom>
        {getTranslatedVocabularyName(t, vocabulary.id)}
      </Typography>
      <StyledButtonRow>
        <ToggleButtonGroup
          color="primary"
          disabled={isUpdating}
          value={isUpdating ? null : vocabulary.status}
          exclusive
          onChange={async (event, value) => {
            if (value) {
              setIsUpdating(true);
              await updateVocabularies({ ...vocabulary, status: value });
              setIsUpdating(false);
            }
            return null;
          }}>
          <ToggleButton value={VocabularyStatus.Default}>{t('default')}</ToggleButton>
          <ToggleButton value={VocabularyStatus.Allowed}>{t('allowed')}</ToggleButton>
          <ToggleButton value={VocabularyStatus.Disabled}>{t('disabled')}</ToggleButton>
        </ToggleButtonGroup>
        {isUpdating && <CircularProgress />}
      </StyledButtonRow>
    </StyledVocabularyRow>
  );
};
