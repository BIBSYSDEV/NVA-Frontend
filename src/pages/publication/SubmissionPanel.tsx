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
import { publishPublication } from '../../api/publicationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';

const StyledButtonGroupContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButtonContainer = styled.div`
  display: inline-block;
  margin-top: 1rem;
  margin-right: 0.5rem;
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
  const { setFieldTouched, setFieldValue, values, isValid }: FormikProps<FormikPublication> = useFormikContext();
  const history = useHistory();
  const { publicationType, reference } = values.entityDescription;
  const dispatch = useDispatch();

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

  const onClickPublish = async () => {
    await savePublication(values);
    const publishedPublication = await publishPublication(values.identifier);
    if (publishedPublication?.error) {
      dispatch(setNotification(publishedPublication.error, NotificationVariant.Error));
    } else {
      history.push(`/publication/${values.identifier}/public`);
    }
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
                    disabled={!isValid}
                  />
                }
                label={t('submission.ask_for_doi')}
              />
            )}
          </Field>
        </Card>
      </Card>
      <StyledButtonGroupContainer>
        <StyledButtonContainer>
          <Button color="primary" variant="contained" onClick={onClickPublish} disabled={isSaving || !isValid}>
            {t('common:publish')}
          </Button>
        </StyledButtonContainer>

        <StyledButtonContainer>
          <ButtonWithProgress isLoading={isSaving} onClick={() => savePublication(values)}>
            {t('common:save')}
          </ButtonWithProgress>
        </StyledButtonContainer>
      </StyledButtonGroupContainer>
    </>
  );
};

export default SubmissionPanel;
