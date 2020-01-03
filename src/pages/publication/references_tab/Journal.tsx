import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PublicationChannel } from './../../../types/references.types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

const StyledJournal = styled.div`
  margin-top: 0.5rem;
  border-color: black;
  border-width: 1pt;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: grid;
  grid-column-gap: 0.5rem;
  align-items: center;
  grid-template-areas:
    'icon titleLabel levelLabel publisherLabel button'
    'icon title level publisher button';
  grid-template-columns: 5% 40% 10% 30% 10%;
`;

const StyledJournalLabel = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
`;

const StyledIssnLabel = styled(StyledJournalLabel)`
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
`;

interface JournalProps {
  journal: PublicationChannel;
  setValue: (value: string) => void;
}

const Journal: React.FC<JournalProps> = ({ journal, setValue }) => {
  const { t } = useTranslation('publication');

  return journal ? (
    <StyledJournal>
      <StyledIssnLabel>{t('references.journal')}</StyledIssnLabel>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      <StyledPublisherLabel>{t('references.publisher')}</StyledPublisherLabel>
      {journal?.level ? <StyledCheckCircleIcon /> : <StyledCancelIcon />}
      <StyledTitleText>{journal?.title}</StyledTitleText>
      <StyledLevelText>{journal?.level}</StyledLevelText>
      <StyledPublisherText>{journal?.publisher}</StyledPublisherText>
      <StyledButton onClick={() => setValue('')}>
        <DeleteIcon />
        {t('references.remove')}
      </StyledButton>
    </StyledJournal>
  ) : null;
};

export default Journal;
