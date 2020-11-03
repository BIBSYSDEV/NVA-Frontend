import React, { useEffect, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext, setNestedObjectValues } from 'formik';
import { Registration, DoiRequestStatus, RegistrationStatus } from '../../types/registration.types';
import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
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
import { useHistory } from 'react-router-dom';
import LabelContentRow from '../../components/LabelContentRow';
import ErrorSummary from './submission_tab/ErrorSummary';
import { publishRegistration } from '../../api/registrationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { RootStore } from '../../redux/reducers/rootReducer';
import { NAVIGATE_TO_PUBLIC_REGISTRATION_DURATION } from '../../utils/constants';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';

const StyledButton = styled(Button)`
  margin-left: 0.5rem;
`;

const StyledButtonWithProgress = styled(ButtonWithProgress)`
  margin-left: 0.5rem;
`;

interface SubmissionPanelProps {
  isSaving: boolean;
  saveRegistration: () => Promise<boolean>;
}

const SubmissionPanel: FC<SubmissionPanelProps> = ({ isSaving, saveRegistration }) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('registration');
  const { values, isValid, dirty, errors, setTouched }: FormikProps<Registration> = useFormikContext();
  const [isPublishing, setIsPublishing] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    status,
    doiRequest,
    entityDescription: { reference },
  } = values;
  const publicationContextType = reference.publicationContext.type;

  useEffect(() => {
    // Set all fields with error to touched to ensure tabs with error are showing error state
    setTouched(setNestedObjectValues(errors, true));
  }, [setTouched, errors]);

  const onClickPublish = async () => {
    setIsPublishing(true);
    const RegistrationIsUpdated = dirty ? await saveRegistration() : true;
    if (RegistrationIsUpdated) {
      const publishedRegistration = await publishRegistration(values.identifier);
      if (publishedRegistration?.error) {
        setIsPublishing(false);
        dispatch(setNotification(publishedRegistration.error, NotificationVariant.Error));
      } else if (publishedRegistration?.info) {
        dispatch(setNotification(publishedRegistration.info, NotificationVariant.Info));
        setTimeout(() => {
          history.push(`/registration/${values.identifier}/public`);
        }, NAVIGATE_TO_PUBLIC_REGISTRATION_DURATION);
      } else {
        history.push(`/registration/${values.identifier}/public`);
      }
    }
  };

  const onClickSaveAndPresent = async () => {
    const registrationIsUpdated = await saveRegistration();
    if (registrationIsUpdated) {
      history.push(`/registration/${values.identifier}/public`);
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

      <StyledRightAlignedWrapper>
        {user.isCurator && doiRequest?.status === DoiRequestStatus.Requested && (
          <>
            <StyledButton
              color="primary"
              variant="contained"
              data-testid="button-create-doi"
              onClick={onClickCreateDoi}
              disabled={isSaving || !isValid}>
              {t('common:create_doi')}
            </StyledButton>
            <StyledButton
              color="secondary"
              variant="outlined"
              data-testid="button-reject-doi"
              onClick={onClickRejectDoi}
              disabled={isSaving || !isValid}>
              {t('common:reject_doi')}
            </StyledButton>
          </>
        )}

        <StyledButtonWithProgress
          type="submit"
          disabled={isPublishing}
          isLoading={isSaving}
          data-testid="button-save-registration"
          onClick={onClickSaveAndPresent}>
          {t('common:save_and_present')}
        </StyledButtonWithProgress>

        {status === RegistrationStatus.DRAFT && (
          <StyledButtonWithProgress
            disabled={isSaving || !isValid}
            data-testid="button-publish-registration"
            onClick={onClickPublish}
            isLoading={isPublishing}>
            {t('common:publish')}
          </StyledButtonWithProgress>
        )}
      </StyledRightAlignedWrapper>
    </>
  );
};

export default SubmissionPanel;
