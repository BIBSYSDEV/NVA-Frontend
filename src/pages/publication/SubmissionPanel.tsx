import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import SubmissionBookPresentation from './submission_tab/submission_book_presentation';
import SubmissionDegreePresentation from './submission_tab/submission_degree_presentation';
import SubmissionChapterPresentation from './submission_tab/submission_chapter_presentation';
import SubmissionReportPresentation from './submission_tab/submission_report_presentation';
import SubmissionJournalPublicationPresentation from './submission_tab/submission_journal_publication_presentation';
import SubmissionDescriptionPresentation from './submission_tab/submission_description_presentation';
import SubmissionFilesAndLicensesPresentation from './submission_tab/submission_files_licenses_presentation';
import SubmissionContributorsPresentation from './submission_tab/submission_contributors_presentation';
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
        <SubmissionDescriptionPresentation />

        <Typography variant="h2">{t('heading.references')}</Typography>
        {values.reference.type === ReferenceType.BOOK && <SubmissionBookPresentation />}
        {values.reference.type === ReferenceType.DEGREE && <SubmissionDegreePresentation />}
        {values.reference.type === ReferenceType.CHAPTER && <SubmissionChapterPresentation />}
        {values.reference.type === ReferenceType.REPORT && <SubmissionReportPresentation />}
        {values.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublicationPresentation />}

        <Typography variant="h2">{t('heading.contributors')}</Typography>
        <SubmissionContributorsPresentation />

        <Typography variant="h2">{t('heading.files_and_license')}</Typography>
        <SubmissionFilesAndLicensesPresentation />
      </Box>
      <StyledPublishButton color="primary" variant="contained">
        {t('Publish')}
      </StyledPublishButton>
    </TabPanel>
  );
};

export default SubmissionPanel;
