import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button, Typography } from '@material-ui/core';
import LabelContentLine from '../../components/LabelContentLine';
import styled from 'styled-components';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubmissionBookPresentation from './submission_tab/submission_book_presentation';
import SubmissionDegreePresentation from './submission_tab/submission_degree_presentation';
import SubmissionChapterPresentation from './submission_tab/submission_chapter_presentation';
import SubmissionReportPresentation from './submission_tab/submission_report_presentation';
import SubmissionJournalPublicationPresentation from './submission_tab/submission_journal_publication_presentation';
import SubmissionDescriptionPresentation from './submission_tab/submission_description_presentation';

const StyledContentText = styled.div`
  margin-bottom: 0.3rem;
  font-weight: bold;
`;

const StyledExpansionPanel = styled(ExpansionPanel)``;

const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)``;

const SubmissionPanel: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  values.title.nb =
    'PhD prosjekt: Selvbestemmelse uten ord - utfordrende relasjoner mellom person med alvorlig utviklingshemming og profesjonelle';

  return (
    <TabPanel ariaLabel="submission">
      <Box>
        <Typography variant="h1">{t('heading.summary')}</Typography>
        <StyledContentText>{values.title.nb}</StyledContentText>

        <Typography variant="h2">{t('heading.description')}</Typography>
        <SubmissionDescriptionPresentation />

        <Typography variant="h2">{t('heading.references')}</Typography>
        <SubmissionBookPresentation />
        <SubmissionDegreePresentation />
        <SubmissionChapterPresentation />
        <SubmissionReportPresentation />
        <SubmissionJournalPublicationPresentation />
        {/*{values.reference.type === ReferenceType.BOOK && <SubmissionBookPresentation />}*/}
        {/*{values.reference.type === ReferenceType.DEGREE && <SubmissionDegreePresentation />}*/}
        {/*{values.reference.type === ReferenceType.CHAPTER && <SubmissionChapterPresentation />}*/}
        {/*{values.reference.type === ReferenceType.REPORT && <SubmissionReportPresentation />}*/}
        {/*{values.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublicationPresentation />}*/}

        <Typography variant="h2">{t('heading.references')}</Typography>
        <h2>{t('heading.contributors')}</h2>

        <Typography variant="h2">{t('heading.references')}</Typography>
        <h2>{t('heading.files_and_license')}</h2>

        <hr />
        <StyledExpansionPanel variant="outlined">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            {t('heading.contributors')}
          </ExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <LabelContentLine label={t('description.tags')}>{`${values.tags.join(', ')}`}</LabelContentLine>
            <LabelContentLine label={t('common:language')}>{t(`languages:${values.language}`)}</LabelContentLine>
          </StyledExpansionPanelDetails>
        </StyledExpansionPanel>
      </Box>

      <Button color="primary" variant="contained">
        {t('Publish')}
      </Button>
      {/*<Button variant="contained">{t('Save')}</Button>*/}

      {/*<div>{t('delete_registration')}</div>*/}
    </TabPanel>
  );
};

export default SubmissionPanel;
