import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';

interface JournalProps {}

const StyledJournal = styled.div``;

const Journal: React.FC<JournalProps> = ({}) => {
  return (
    <StyledJournal>
      <Field name="reference.journalPublication.journal" component="TextField" />
    </StyledJournal>
  );
};
