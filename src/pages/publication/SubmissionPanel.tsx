import React, { useEffect, FC } from 'react';
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
import { PublicationType } from '../../types/publicationFieldNames';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';
import { useHistory } from 'react-router';
import LabelContentRow from '../../components/LabelContentRow';
import ErrorSummary from './submission_tab/ErrorSummary';
import { DOI_PREFIX } from '../../utils/constants';
import { publishPublication } from '../../api/publicationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import {
  touchedFilesTabFields,
  touchedContributorTabFields,
  touchedDescriptionTabFields,
  touchedReferenceTabFields,
  mergeTouchedFields,
} from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';

const StyledButtonGroupContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  margin-right: 0.5rem;
`;

enum PublishSettingFieldName {
  SHOULD_CREATE_DOI = 'shouldCreateDoi',
}

interface SubmissionPanelProps extends PanelProps {
  isSaving: boolean;
  savePublication: (values: FormikPublication) => void;
}

const SubmissionPanel: FC<SubmissionPanelProps> = ({ isSaving, savePublication, setTouchedFields }) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('publication');
  const { setFieldValue, values, isValid }: FormikProps<FormikPublication> = useFormikContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    entityDescription: { contributors, reference },
    fileSet: { files },
  } = values;
  const publicationContextType = reference.publicationContext.type;

  useEffect(() => {
    const touchedForm = mergeTouchedFields([
      touchedDescriptionTabFields,
      touchedReferenceTabFields,
      touchedContributorTabFields(contributors),
      touchedFilesTabFields(files),
    ]);
    setTouchedFields(touchedForm);
  }, [setTouchedFields, contributors, files]);

  const onClickPublish = async () => {
    await savePublication(values);
    const publishedPublication = await publishPublication(values.identifier);
    if (publishedPublication?.error) {
      dispatch(setNotification(publishedPublication.error, NotificationVariant.Error));
    } else {
      history.push(`/publication/${values.identifier}/public`);
    }
  };

  const onClickCreateDoi = () => {
    // TODO: create doi here
  };

  const onClickRejectDoi = () => {
    // TODO: reject doi here
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
            {publicationContextType && t(`publicationTypes:${publicationContextType}`)}
          </LabelContentRow>
          {reference.doi && (
            <LabelContentRow label={t('publication.link_to_publication')}>
              {`${DOI_PREFIX}${reference.doi}`}
            </LabelContentRow>
          )}
          {publicationContextType === PublicationType.BOOK && <SubmissionBook />}
          {publicationContextType === PublicationType.DEGREE && <SubmissionDegree />}
          {publicationContextType === PublicationType.CHAPTER && <SubmissionChapter />}
          {publicationContextType === PublicationType.REPORT && <SubmissionReport />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && <SubmissionJournalPublication />}
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
        {/* TODO: need to check if the author also has made a request for doi in the conditional below */}
        {user.isCurator ? (
          <>
            <StyledButton
              color="primary"
              variant="contained"
              onClick={onClickCreateDoi}
              disabled={isSaving || !isValid}>
              {t('common:create_doi')}
            </StyledButton>
            <StyledButton
              color="secondary"
              variant="outlined"
              onClick={onClickRejectDoi}
              disabled={isSaving || !isValid}>
              {t('common:reject_doi')}
            </StyledButton>
          </>
        ) : (
          <StyledButton color="primary" variant="contained" onClick={onClickPublish} disabled={isSaving || !isValid}>
            {t('common:publish')}
          </StyledButton>
        )}

        <ButtonWithProgress isLoading={isSaving} onClick={() => savePublication(values)}>
          {t('common:save')}
        </ButtonWithProgress>
      </StyledButtonGroupContainer>
    </>
  );
};

export default SubmissionPanel;
