import React, { useEffect, useCallback } from 'react';
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
import { PublicationType, PublicationFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';
import { useHistory } from 'react-router';
import LabelContentRow from '../../components/LabelContentRow';
import ErrorSummary from './submission_tab/ErrorSummary';

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
  const { errors, setFieldTouched, setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();
  const history = useHistory();

  const setAllFieldsTouched = useCallback(() => {
    Object.values(DescriptionFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
    Object.values(PublicationFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
  }, [setFieldTouched]);

  useEffect(() => {
    setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  const publishPublication = () => {
    savePublication();
    history.push(`/publication/${values.identifier}/public`);
  };

  const { publicationType, reference } = values.entityDescription;
  const validationErrors = errors.entityDescription;

  return (
    <TabPanel ariaLabel="submission">
      <ErrorSummary />
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
