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
    'journal journal journal'
    'issnLabel levelLabel publisherLabel'
    'issn level publisher';
  grid-template-columns: '33% 33% 33%';
`;

const StyledJournalTitle = styled.div`
  grid-area: 'journal';
`;

const StyledJournalLabel = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
`;

const Journal: React.FC<JournalProps> = ({ journal }) => {
  const { t } = useTranslation();

  return (
    <StyledJournal>
      <Field name="reference.journalPublication.journal">
        {({ field }: any) => {
          return (
            <StyledJournalTitle>
              <TextField>{field.value}</TextField>
            </StyledJournalTitle>
          );
        }}
      </Field>
      <StyledJournalLabel>{t('reference.issn')}</StyledJournalLabel>
      <StyledJournalLabel>{t('reference.level')}</StyledJournalLabel>
      <StyledJournalLabel>{t('reference.publisher')}</StyledJournalLabel>
      <div>{journal.issn}</div>
      <div>{journal.level}</div>
      <div>{journal.publisher}</div>
    </StyledJournal>
  );
};

export default Journal;
