import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PublicationChannel } from './../../../types/references.types';
import { TextField } from '@material-ui/core';

interface JournalProps {
  journal: PublicationChannel;
}

const StyledJournal = styled.div`
  display: grid;
  grid-column-gap: 0.5rem;
  align-items: center;
  grid-template-areas:
    'journalTitle journalTitle journalTitle'
    'issnLabel levelLabel publisherLabel'
    'issn level publisher';
  grid-template-columns: 33% 33% 33%;
`;

const StyledJournalTitle = styled.div`
  grid-area: 'journalTitle';
`;

const StyledJournalLabel = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
`;

const StyledIssnLabel = styled(StyledJournalLabel)`
  grid-area: 'issnLabel';
`;

const StyledLevelLabel = styled(StyledJournalLabel)`
  grid-area: 'levelLabel';
`;

const StyledPublisherLabel = styled(StyledJournalLabel)`
  grid-area: 'publisherLabel';
`;

const StyledIssnText = styled.div`
  grid-area: 'issn';
`;

const StyledLevelText = styled.div`
  grid-area: 'level';
`;

const StyledPublisherText = styled.div`
  grid-area: 'publisher';
`;

const Journal: React.FC<JournalProps> = ({ journal }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledJournal>
      <StyledJournalTitle>
        <Field name="reference.journalPublication.journal">
          {({ field }: any) => {
            return (
              <TextField variant="outlined" label={t('references.journal')}>
                {field.value}
              </TextField>
            );
          }}
        </Field>
      </StyledJournalTitle>
      <StyledIssnLabel>{t('references.issn')}</StyledIssnLabel>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      <StyledPublisherLabel>{t('references.publisher')}</StyledPublisherLabel>
      <StyledIssnText>{`issn: ${journal.issn}`}</StyledIssnText>
      <StyledLevelText>{`level: ${journal.level}`}</StyledLevelText>
      <StyledPublisherText>{`publisher: ${journal.publisher}`}</StyledPublisherText>
    </StyledJournal>
  );
};

export default Journal;
