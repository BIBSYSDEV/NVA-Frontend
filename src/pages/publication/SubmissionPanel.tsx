import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button, Typography } from '@material-ui/core';
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
import SubmissionContentText from './submission_tab/submission_content_text';

const StyledPublishButton = styled(Button)`
  margin-top: 0.5rem;
`;

const SubmissionPanel: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <TabPanel ariaLabel="submission">
      <Box>
        <Typography variant="h1">{t('heading.summary')}</Typography>
        <hr />
        <SubmissionContentText>{values.title.nb}</SubmissionContentText>

        <Typography variant="h2">{t('heading.description')}</Typography>
        <SubmissionDescription />

        <Typography variant="h2">{t('heading.references')}</Typography>
        {values.reference.type === ReferenceType.BOOK && <SubmissionBook />}
        {values.reference.type === ReferenceType.DEGREE && <SubmissionDegree />}
        {values.reference.type === ReferenceType.CHAPTER && <SubmissionChapter />}
        {values.reference.type === ReferenceType.REPORT && <SubmissionReport />}
        {values.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}

        <Typography variant="h2">{t('heading.contributors')}</Typography>
        <SubmissionContributors />

        <Typography variant="h2">{t('heading.files_and_license')}</Typography>
        <SubmissionFilesAndLicenses />
      </Box>
      <StyledPublishButton color="primary" variant="contained">
        {t('Publish')}
      </StyledPublishButton>
    </TabPanel>
  );
};

export default SubmissionPanel;
