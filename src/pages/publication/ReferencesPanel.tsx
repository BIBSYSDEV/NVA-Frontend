import { Field, useFormikContext } from 'formik';
import { Select } from 'formik-material-ui';
import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import {
  ReferenceType,
  referenceTypeList,
  ReferenceFieldNames,
  journalPublicationFieldNames,
  BookFieldNames,
} from '../../types/references.types';

import BookReferenceForm from './references_tab/BookReferenceForm';
import JournalPublicationReferenceForm from './references_tab/JournalPublicationReferenceForm';
import ReportReferenceForm from './references_tab/ReportReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';

const StyledBox = styled.div`
  margin-top: 1rem;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
}

export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched }: any = useFormikContext();
  const { referenceType } = values.reference;

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(ReferenceFieldNames).forEach(fieldName => setFieldTouched(fieldName));

    switch (referenceType) {
      case ReferenceType.BOOK:
        Object.values(BookFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.PUBLICATION_IN_JOURNAL:
        Object.values(journalPublicationFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      default:
        break;
    }
  }, [setFieldTouched, referenceType]);

  useEffect(() => {
    // Set all fields as touched if user navigates away from this panel ( on unmount)
    return () => setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  return (
    <TabPanel
      ariaLabel="references"
      goToNextTab={goToNextTab}
      heading={t('publication:heading.references')}
      onClickSave={() => savePublication()}>
      <Field
        name={ReferenceFieldNames.REFERENCE_TYPE}
        aria-label="referenceType"
        variant="outlined"
        fullWidth
        component={Select}>
        {referenceTypeList.map(type => (
          <MenuItem value={type.value} key={type.value} data-testid={`referenceType-${type}`}>
            {t(type.label)}
          </MenuItem>
        ))}
      </Field>

      {referenceType && (
        <StyledBox>
          <Box>
            {referenceType === ReferenceType.BOOK && <BookReferenceForm />}
            {referenceType === ReferenceType.CHAPTER && <ChapterReferenceForm />}
            {referenceType === ReferenceType.REPORT && <ReportReferenceForm />}
            {referenceType === ReferenceType.DEGREE && <DegreeReferenceForm />}
            {referenceType === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalPublicationReferenceForm />}
          </Box>
        </StyledBox>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
