import { ToggleButtonGroup, ToggleButton, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
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
  updateVocabulary: (updatedVocabulary: CustomerVocabulary) => void;
  isLoadingCustomer: boolean;
}

export const VocabularyRow = ({ vocabulary, updateVocabulary, isLoadingCustomer }: VocabularyRowProps) => {
  const { t } = useTranslation('editor');
  const [isLoading, setIsLoading] = useState(isLoadingCustomer);

  useEffect(() => {
    if (!isLoadingCustomer) {
      setIsLoading(false);
    }
  }, [isLoadingCustomer]);

  return (
    <StyledVocabularyRow>
      <Typography variant="h3" gutterBottom>
        {getTranslatedVocabularyName(t, vocabulary.id)}
      </Typography>
      <StyledButtonRow>
        <ToggleButtonGroup
          color="primary"
          disabled={isLoading}
          value={isLoading ? null : vocabulary.status}
          exclusive
          onChange={(event, value) => {
            if (value) {
              updateVocabulary({ ...vocabulary, status: value });
              setIsLoading(true);
            }
            return null;
          }}>
          <ToggleButton value={VocabularyStatus.Default}>{t('default')}</ToggleButton>
          <ToggleButton value={VocabularyStatus.Allowed}>{t('allowed')}</ToggleButton>
          <ToggleButton value={VocabularyStatus.Disabled}>{t('disabled')}</ToggleButton>
        </ToggleButtonGroup>
        {isLoading && <CircularProgress />}
      </StyledButtonRow>
    </StyledVocabularyRow>
  );
};
