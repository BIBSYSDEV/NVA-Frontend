import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import React, { useState, useEffect, useCallback } from 'react';
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

const referencePanelNumber = 2;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
  tabNumber: number;
  selectedReferenceType: string;
  setFieldTouched: (fieldName: string) => void;
}

export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({
  goToNextTab,
  savePublication,
  tabNumber,
  selectedReferenceType,
  setFieldTouched,
}) => {
  const { t } = useTranslation('publication');
  const [isVisited, setIsVisited] = useState(false);
  const [allFieldsAreTouched, setAllFieldsAreTouched] = useState(false);

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(ReferenceFieldNames).forEach(fieldName => setFieldTouched(fieldName));

    switch (selectedReferenceType) {
      case ReferenceType.BOOK:
        Object.values(BookFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.PUBLICATION_IN_JOURNAL:
        Object.values(journalPublicationFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      default:
        break;
    }

    setAllFieldsAreTouched(true);
  }, [setFieldTouched, selectedReferenceType]);

  // Set all fields as touched if user navigates away from this panel.
  useEffect(() => {
    if (tabNumber === referencePanelNumber) {
      setIsVisited(true);
    } else if (isVisited && !allFieldsAreTouched) {
      setAllFieldsTouched();
    }
  }, [setAllFieldsTouched, isVisited, allFieldsAreTouched, tabNumber]);

  // Ensure validation are triggered again after user changes reference type
  useEffect(() => {
    setAllFieldsAreTouched(false);
  }, [selectedReferenceType]);

  return (
    <TabPanel
      ariaLabel="references"
      goToNextTab={goToNextTab}
      heading={t('publication:heading.references')}
      isHidden={tabNumber !== referencePanelNumber}
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

      {selectedReferenceType && (
        <StyledBox>
          <Box>
            {selectedReferenceType === ReferenceType.BOOK && <BookReferenceForm />}
            {selectedReferenceType === ReferenceType.CHAPTER && <ChapterReferenceForm />}
            {selectedReferenceType === ReferenceType.REPORT && <ReportReferenceForm />}
            {selectedReferenceType === ReferenceType.DEGREE && <DegreeReferenceForm />}
            {selectedReferenceType === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalPublicationReferenceForm />}
          </Box>
        </StyledBox>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
