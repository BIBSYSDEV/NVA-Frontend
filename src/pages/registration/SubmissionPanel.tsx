import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext, setNestedObjectValues } from 'formik';
import { Registration } from '../../types/registration.types';
import { Typography } from '@material-ui/core';
import SubmissionBook from './submission_tab/submission_book';
// import SubmissionChapter from './submission_tab/submission_chapter';
import SubmissionDegree from './submission_tab/submission_degree';
import SubmissionReport from './submission_tab/submission_report';
import SubmissionJournalPublication from './submission_tab/submission_journal';
import SubmissionDescription from './submission_tab/submission_description';
import SubmissionFilesAndLicenses from './submission_tab/submission_files_licenses';
import SubmissionContributors from './submission_tab/submission_contributors';
import { PublicationType } from '../../types/publicationFieldNames';
import Card from '../../components/Card';
import LabelContentRow from '../../components/LabelContentRow';
import ErrorSummary from './submission_tab/ErrorSummary';

const SubmissionPanel: FC = () => {
  const { t } = useTranslation('registration');
  const { values, errors, setTouched } = useFormikContext<Registration>();

  const {
    entityDescription: { reference },
  } = values;
  const publicationContextType = reference.publicationContext.type;

  useEffect(() => {
    // Set all fields with error to touched to ensure tabs with error are showing error state
    setTouched(setNestedObjectValues(errors, true));
  }, [setTouched, errors]);

  return (
    <>
      <ErrorSummary />
      <Card>
        <Typography variant="h2">{t('heading.summary')}</Typography>
        <Card>
          <Typography variant="h5">{t('heading.description')}</Typography>
          <SubmissionDescription />
        </Card>
        <Card>
          <Typography variant="h5">{t('heading.reference')}</Typography>
          <LabelContentRow label={t('common:type')}>
            {publicationContextType && t(`publicationTypes:${publicationContextType}`)}
          </LabelContentRow>
          {reference.doi && (
            <LabelContentRow label={t('registration.link_to_resource')}>{reference.doi}</LabelContentRow>
          )}
          {publicationContextType === PublicationType.DEGREE && <SubmissionDegree />}
          {publicationContextType === PublicationType.BOOK && <SubmissionBook />}
          {/* {publicationContextType === PublicationType.CHAPTER && <SubmissionChapter />} */}
          {publicationContextType === PublicationType.REPORT && <SubmissionReport />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}
        </Card>
        <Card>
          <Typography variant="h5">{t('heading.contributors')}</Typography>
          <SubmissionContributors />
        </Card>
        <Card>
          <Typography variant="h5">{t('heading.files_and_license')}</Typography>
          <SubmissionFilesAndLicenses />
        </Card>
      </Card>
    </>
  );
};

export default SubmissionPanel;
