import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import SubmissionBook from './submission_tab/submission_book';
import SubmissionDegree from './submission_tab/submission_degree';
import SubmissionChapter from './submission_tab/submission_chapter';
import SubmissionReport from './submission_tab/submission_report';
import SubmissionJournalPublication from './submission_tab/submission_journal';
import SubmissionDescription from './submission_tab/submission_description';
import SubmissionFilesAndLicenses from './submission_tab/submission_files_licenses';
import SubmissionContributors from './submission_tab/submission_contributors';
import { ReferenceType } from '../../types/references.types';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import FormCardSubHeading from '../../components/FormCard/FormCardSubHeading';
import FormCard from '../../components/FormCard/FormCard';
import { useHistory } from 'react-router';

const StyledPublishButton = styled(Button)`
  margin-top: 0.5rem;
`;

interface SubmissionPanelProps {
  savePublication: () => void;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ savePublication }) => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const history = useHistory();

  const publishPublication = () => {
    savePublication();
    history.push(`/publication/${values.id}`);
  };

  return (
    <TabPanel ariaLabel="submission">
      <FormCard>
        <FormCardHeading>{t('heading.summary')}</FormCardHeading>
        <FormCard>
          <FormCardSubHeading>{t('heading.description')}</FormCardSubHeading>
          <SubmissionDescription />
        </FormCard>
        <FormCard>
          <FormCardSubHeading>{t('heading.references')}</FormCardSubHeading>
          {values.reference.type === ReferenceType.BOOK && <SubmissionBook />}
          {values.reference.type === ReferenceType.DEGREE && <SubmissionDegree />}
          {values.reference.type === ReferenceType.CHAPTER && <SubmissionChapter />}
          {values.reference.type === ReferenceType.REPORT && <SubmissionReport />}
          {values.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}
        </FormCard>
        <FormCard>
          <FormCardSubHeading>{t('heading.contributors')}</FormCardSubHeading>
          <SubmissionContributors />
        </FormCard>
        <FormCard>
          <FormCardSubHeading>{t('heading.files_and_license')}</FormCardSubHeading>
          <SubmissionFilesAndLicenses />
        </FormCard>
      </FormCard>
      <StyledPublishButton color="primary" variant="contained" onClick={publishPublication}>
        {t('common:publish')}
      </StyledPublishButton>
    </TabPanel>
  );
};

export default SubmissionPanel;
