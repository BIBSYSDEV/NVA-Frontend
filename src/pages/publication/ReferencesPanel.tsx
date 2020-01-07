import { Field, FormikProps, useFormikContext } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { PublicationFormsData } from '../../types/form.types';
import {
  BookFieldNames,
  journalPublicationFieldNames,
  ReferenceFieldNames,
  ReferenceType,
  referenceTypeLanguageKeyMap,
} from '../../types/references.types';
import BookReferenceForm from './references_tab/BookReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';
import JournalPublicationReferenceForm from './references_tab/JournalPublicationReferenceForm';
import ReportReferenceForm from './references_tab/ReportReferenceForm';

const StyledBox = styled.div`
  margin-top: 1rem;
`;

const StyledTypeHeading = styled.div`
  font-size: 1.5rem;
  padding-bottom: 1rem;
  font-weight: bold;
`;

const StyledSelectContainer = styled.div`
  width: 50%;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
}

export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched }: FormikProps<PublicationFormsData> = useFormikContext();
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
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={() => savePublication()}>
      <StyledSelectContainer>
        <Field name={ReferenceFieldNames.REFERENCE_TYPE}>
          {({ field: { onChange, name, value } }: any) => (
            <FormControl variant="outlined" fullWidth>
              <InputLabel>{t('common:type')}</InputLabel>
              <Select value={value} onChange={onChange(name, value)}>
                {Object.keys(referenceTypeLanguageKeyMap).map(type => (
                  <MenuItem value={type} key={type} data-testid={`referenceType-${type}`}>
                    {t(referenceTypeLanguageKeyMap[type])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Field>
      </StyledSelectContainer>

      {referenceType && (
        <StyledBox>
          <Box>
            <StyledTypeHeading>{t(referenceTypeLanguageKeyMap[referenceType])}</StyledTypeHeading>
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
