import React, { useEffect, useRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext, Field, FieldProps } from 'formik';
import { FormikPublication } from '../../types/publication.types';
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
import { PublicationType, ReferenceFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';
import { useHistory } from 'react-router';
import LabelContentRow from '../../components/LabelContentRow';
import ErrorSummary from './submission_tab/ErrorSummary';
import { getAllFileFields, getAllContributorFields } from '../../utils/formik-helpers';
import { DOI_PREFIX } from '../../utils/constants';
import Progress from '../../components/Progress';

const StyledButtonContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

enum PublishSettingFieldName {
  SHOULD_CREATE_DOI = 'shouldCreateDoi',
}

interface SubmissionPanelProps {
  isSaving: boolean;
  savePublication: (values: FormikPublication) => void;
}

const SubmissionPanel: FC<SubmissionPanelProps> = ({ isSaving, savePublication }) => {
  const { t } = useTranslation('publication');
  const { errors, setFieldTouched, setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();
  const history = useHistory();
  const { publicationType, reference } = values.entityDescription;

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    const fieldNames = [
      ...Object.values(DescriptionFieldNames),
      ...Object.values(ReferenceFieldNames),
      ...getAllContributorFields(valuesRef.current.entityDescription.contributors),
      ...getAllFileFields(valuesRef.current.fileSet.files),
    ];
    fieldNames.forEach((fieldName) => setFieldTouched(fieldName));
  }, [setFieldTouched]);

  const publishPublication = () => {
    // TODO: change status from draft to published
    history.push(`/publication/${values.identifier}/public`);
  };

  return (
    <>
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
              {`${DOI_PREFIX}${reference.doi}`}
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
                    disabled={!!errors.entityDescription || !!errors.fileSet}
                  />
                }
                label={t('submission.ask_for_doi')}
              />
            )}
          </Field>
        </Card>
      </Card>
      <StyledButtonContainer>
        <StyledButton
          color="primary"
          variant="contained"
          onClick={publishPublication}
          disabled={!!errors.entityDescription || !!errors.fileSet}>
          {t('common:publish')}
        </StyledButton>
        <StyledButton disabled={isSaving} onClick={() => savePublication(values)} variant="contained">
          {t('common:save')}
          {isSaving && (
            <StyledProgressContainer>
              <Progress size={15} thickness={5} />
            </StyledProgressContainer>
          )}
        </StyledButton>
      </StyledButtonContainer>
    </>
  );
};

export default SubmissionPanel;
