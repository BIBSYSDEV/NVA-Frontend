import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext, Field, FieldProps } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
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
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';
import { useHistory } from 'react-router';

const StyledPublishButton = styled(Button)`
  margin-top: 0.5rem;
`;

enum PublishSettingFieldName {
  SHOULD_CREATE_DOI = 'shouldCreateDoi',
}

interface SubmissionPanelProps {
  savePublication: () => void;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ savePublication }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldValue }: FormikProps<Publication> = useFormikContext();
  const history = useHistory();

  const publishPublication = () => {
    savePublication();
    history.push(`/publication/${values.id}`);
  };

  return (
    <TabPanel ariaLabel="submission">
      <Card>
        <Heading>{t('heading.summary')}</Heading>
        <Card>
          <SubHeading>{t('heading.description')}</SubHeading>
          <SubmissionDescription />
        </Card>
        <Card>
          <SubHeading>{t('heading.references')}</SubHeading>
          {values.reference.type === ReferenceType.BOOK && <SubmissionBook />}
          {values.reference.type === ReferenceType.DEGREE && <SubmissionDegree />}
          {values.reference.type === ReferenceType.CHAPTER && <SubmissionChapter />}
          {values.reference.type === ReferenceType.REPORT && <SubmissionReport />}
          {values.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}
        </Card>
        <Card>
          <SubHeading>{t('heading.contributors')}</SubHeading>
          <SubmissionContributors />
        </Card>
        <Card>
          <SubHeading>{t('heading.files_and_license')}</SubHeading>
          <SubmissionFilesAndLicenses />
        </Card>
        <Card>
          <SubHeading>{t('heading.publish_settings')}</SubHeading>
          <Field name={PublishSettingFieldName.SHOULD_CREATE_DOI}>
            {({ field: { name, value } }: FieldProps) => (
              <FormControlLabel
                control={<Checkbox color="primary" checked={value} onChange={() => setFieldValue(name, !value)} />}
                label={t('submission.ask_for_doi')}
              />
            )}
          </Field>
        </Card>
      </Card>
      <StyledPublishButton color="primary" variant="contained" onClick={publishPublication}>
        {t('common:publish')}
      </StyledPublishButton>
    </TabPanel>
  );
};

export default SubmissionPanel;
