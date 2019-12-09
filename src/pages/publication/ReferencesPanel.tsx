import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import ReportReferenceForm from './references_tab/ReportReferenceForm';
import BookReferenceForm from './references_tab/BookReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import JournalPublicationReferenceForm from './references_tab/JournalPublicationReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';

const StyledBox = styled.div`
  margin-top: 1rem;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
  tabNumber: number;
  selectedReferenceType: string;
  errors: any;
}

export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({
  goToNextTab,
  savePublication,
  tabNumber,
  selectedReferenceType,
  errors,
}) => {
  const { t } = useTranslation('publication');
  return (
    <TabPanel
      ariaLabel="references"
      errors={errors.referencesErrors}
      goToNextTab={goToNextTab}
      heading={t('publication:heading.references')}
      isHidden={tabNumber !== 2}
      onClickSave={() => savePublication()}>
      <Field name="reference.referenceType" aria-label="referenceType" variant="outlined" fullWidth component={Select}>
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
