import { ErrorMessage, Field, FormikProps, useFormikContext } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, FormHelperText, MenuItem, TextField } from '@material-ui/core';

import TabPanel from '../../components/TabPanel/TabPanel';
import { Publication } from '../../types/publication.types';
import {
  BookFieldNames,
  ChapterFieldNames,
  DegreeFieldNames,
  JournalArticleFieldNames,
  ReferenceFieldNames,
  ReferenceType,
  referenceTypeLanguageKeyMap,
  ReportFieldNames,
} from '../../types/references.types';
import BookReferenceForm from './references_tab/BookReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';
import JournalArticleReferenceForm from './references_tab/JournalArticleReferenceForm';
import ReportReferenceForm from './references_tab/ReportReferenceForm';
import FormCard from '../../components/FormCard/FormCard';

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
  const { values, setFieldTouched }: FormikProps<Publication> = useFormikContext();
  const { type } = values.reference;

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(ReferenceFieldNames).forEach(fieldName => setFieldTouched(fieldName));

    switch (type) {
      case ReferenceType.BOOK:
        Object.values(BookFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.PUBLICATION_IN_JOURNAL:
        Object.values(JournalArticleFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.REPORT:
        Object.values(ReportFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.CHAPTER:
        Object.values(ChapterFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      case ReferenceType.DEGREE:
        Object.values(DegreeFieldNames).forEach(fieldName => setFieldTouched(fieldName));
        break;
      default:
        break;
    }
  }, [setFieldTouched, type]);

  useEffect(() => {
    // Set all fields as touched if user navigates away from this panel ( on unmount)
    return () => setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={() => savePublication()}>
      <StyledSelectContainer>
        <Field name={ReferenceFieldNames.REFERENCE_TYPE}>
          {({ field, meta: { error, touched } }: any) => (
            <FormControl fullWidth error={!!error && touched}>
              <TextField select variant="outlined" {...field} label={t('common:type')} data-testid="reference_type">
                {Object.entries(referenceTypeLanguageKeyMap).map(([key, value]) => (
                  <MenuItem value={key} key={key} data-testid={`reference_type-${key}`}>
                    {t(value)}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText>
                <ErrorMessage name={ReferenceFieldNames.REFERENCE_TYPE} />
              </FormHelperText>
            </FormControl>
          )}
        </Field>
      </StyledSelectContainer>

      {type && (
        <StyledBox>
          <FormCard>
            <StyledTypeHeading data-testid="reference_type-heading">
              {t(referenceTypeLanguageKeyMap[type])}
            </StyledTypeHeading>
            {type === ReferenceType.BOOK && <BookReferenceForm />}
            {type === ReferenceType.CHAPTER && <ChapterReferenceForm />}
            {type === ReferenceType.REPORT && <ReportReferenceForm />}
            {type === ReferenceType.DEGREE && <DegreeReferenceForm />}
            {type === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalArticleReferenceForm />}
          </FormCard>
        </StyledBox>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
