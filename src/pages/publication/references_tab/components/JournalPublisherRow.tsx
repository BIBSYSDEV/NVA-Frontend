import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { PublicationChannel } from '../../../../types/references.types';

const StyledJournalPublisherRow = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'titleLabel levelLabel publisherLabel button'
    'title level publisher button';
  grid-template-columns: 7fr 3fr 3fr 1fr;
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
  onClickDelete: (event: React.MouseEvent<any>) => void;
}

const JournalPublisherRow: React.FC<JournalPublisherRowProps> = ({
  hidePublisher = false,
  publisher,
  label,
  onClickDelete,
}) => {
  const { t } = useTranslation('publication');

  return (
    <StyledJournalPublisherRow>
      <StyledTitle>{label}</StyledTitle>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      {!hidePublisher && <StyledPublisherLabel>{t('references.publisher')}</StyledPublisherLabel>}
      <StyledTitleText>{publisher.title}</StyledTitleText>
      <StyledLevelText>{publisher.level}</StyledLevelText>
      {!hidePublisher && <StyledPublisherText>{publisher.publisher}</StyledPublisherText>}
      <StyledButton onClick={onClickDelete}>
        <DeleteIcon />
        {t('references.remove')}
      </StyledButton>
    </StyledJournalPublisherRow>
  );
};

export default JournalPublisherRow;
