import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext, Field, FieldProps } from 'formik';
import { FormikPublication } from '../../types/publication.types';
import { Button, FormControlLabel, Checkbox, Link } from '@material-ui/core';
import styled from 'styled-components';
import SubmissionBook from './submission_tab/submission_book';
import SubmissionDegree from './submission_tab/submission_degree';
import SubmissionChapter from './submission_tab/submission_chapter';
import SubmissionReport from './submission_tab/submission_report';
import SubmissionJournalPublication from './submission_tab/submission_journal';
import SubmissionDescription from './submission_tab/submission_description';
import SubmissionFilesAndLicenses from './submission_tab/submission_files_licenses';
import SubmissionContributors from './submission_tab/submission_contributors';
import { PublicationType } from '../../types/references.types';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';
import { useHistory } from 'react-router';
import LabelContentRow from '../../components/LabelContentRow';
import NormalText from '../../components/NormalText';

const StyledPublishButton = styled(Button)`
  margin-top: 0.5rem;
`;

const StyledCard = styled(Card)`
  border: 3px solid ${({ theme }) => theme.palette.danger.main};
  background-color: ${({ theme }) => theme.palette.danger.light};
`;

enum PublishSettingFieldName {
  SHOULD_CREATE_DOI = 'shouldCreateDoi',
}

interface SubmissionPanelProps {
  savePublication: () => void;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ savePublication }) => {
  const { t } = useTranslation('publication');
  const { errors, values, setFieldValue }: FormikProps<FormikPublication> = useFormikContext();
  const history = useHistory();

  const publishPublication = () => {
    savePublication();
    history.push(`/publication/${values.identifier}/public`);
  };

  const { publicationType, reference } = values.entityDescription;
  const validationErrors = errors.entityDescription;

  return (
    <TabPanel ariaLabel="submission">
      {validationErrors && (
        <StyledCard>
          <Heading>{t('heading.validation_errors')}</Heading>
          {Object.entries(validationErrors).map(([key, value]) => (
            <NormalText key={key}>
              <b>{t(`formikValues:entityDescription.${key}`)}: </b>
              {value}
            </NormalText>
          ))}
        </StyledCard>
      )}
      <Card>
        <Heading>{t('heading.summary')}</Heading>
        <Card>
          <SubHeading>{t('heading.description')}</SubHeading>
          <SubmissionDescription />
        </Card>
        <Card>
          <SubHeading>{t('heading.references')}</SubHeading>
          <LabelContentRow label={t('common:type')}>
            {publicationType && t(`publicationTypes:${publicationType}`)}
          </LabelContentRow>
          {reference.doi && (
            <LabelContentRow label={t('publication.link_to_publication')}>
              <Link href={reference.doi} target="_blank" rel="noopener noreferrer">
                {reference.doi}
              </Link>
            </LabelContentRow>
          )}
          {publicationType === PublicationType.BOOK && <SubmissionBook />}
          {publicationType === PublicationType.DEGREE && <SubmissionDegree />}
          {publicationType === PublicationType.CHAPTER && <SubmissionChapter />}
          {publicationType === PublicationType.REPORT && <SubmissionReport />}
          {publicationType === PublicationType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}
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
                control={
                  <Checkbox
                    color="primary"
                    checked={value}
                    onChange={() => setFieldValue(name, !value)}
                    disabled={!!validationErrors}
                  />
                }
                label={t('submission.ask_for_doi')}
              />
            )}
          </Field>
        </Card>
      </Card>
      <StyledPublishButton
        color="primary"
        variant="contained"
        onClick={publishPublication}
        disabled={!!validationErrors}>
        {t('common:publish')}
      </StyledPublishButton>
    </TabPanel>
  );
};

export default SubmissionPanel;
