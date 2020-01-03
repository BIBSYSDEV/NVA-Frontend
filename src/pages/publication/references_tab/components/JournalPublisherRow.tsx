import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import { PublicationChannel } from '../../../../types/references.types';

const StyledJournalPublisherRow = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'icon titleLabel levelLabel publisherLabel button'
    'icon title level publisher button';
  grid-template-columns: 1fr 6fr 3fr 3fr 1fr;
`;

const StyledJournalLabel = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
`;

const StyledTitle = styled(StyledJournalLabel)`
  grid-area: titleLabel;
`;

const StyledLevelLabel = styled(StyledJournalLabel)`
  grid-area: levelLabel;
`;

const StyledPublisherLabel = styled(StyledJournalLabel)`
  grid-area: publisherLabel;
`;

const StyledTitleText = styled.div`
  grid-area: title;
`;

const StyledLevelText = styled.div`
  grid-area: level;
`;

const StyledPublisherText = styled.div`
  grid-area: publisher;
`;

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  grid-area: icon;
  color: green;
  margin: 0.5rem;
  font-size: 2rem;
`;

const StyledCancelIcon = styled(CancelIcon)`
  grid-area: icon;
  color: red;
  margin: 0.5rem;
  font-size: 2rem;
`;

const StyledButton = styled(Button)`
  grid-area: button;
  background-color: red;
  color: white;
  margin: 0.5rem;
`;

interface JournalPublisherRowProps {
  hidePublisher?: boolean;
  publisher: Partial<PublicationChannel>;
  label: string;
  setValue: (value: string) => void;
}

const JournalPublisherRow: React.FC<JournalPublisherRowProps> = ({
  hidePublisher = false,
  publisher: journal,
  label,
  setValue,
}) => {
  const { t } = useTranslation('publication');

  return (
    <StyledJournalPublisherRow>
      <StyledTitle>{label}</StyledTitle>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      {!hidePublisher && <StyledPublisherLabel>{t('references.publisher')}</StyledPublisherLabel>}
      {journal.level ? <StyledCheckCircleIcon /> : <StyledCancelIcon />}
      <StyledTitleText>{journal.title}</StyledTitleText>
      <StyledLevelText>{journal.level}</StyledLevelText>
      {!hidePublisher && <StyledPublisherText>{journal.publisher}</StyledPublisherText>}
      <StyledButton onClick={() => setValue('')}>
        <DeleteIcon />
        {t('references.remove')}
      </StyledButton>
    </StyledJournalPublisherRow>
  );
};

export default JournalPublisherRow;
