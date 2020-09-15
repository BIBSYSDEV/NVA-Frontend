import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions, TextField } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RootStore } from '../../../redux/reducers/rootReducer';
import Card from '../../../components/Card';
import NormalText from '../../../components/NormalText';
import { PublicPublicationContentProps } from './PublicPublicationContent';
import Modal from '../../../components/Modal';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { PublicationStatus, DoiRequestStatus } from '../../../types/publication.types';
import { createDoiRequest } from '../../../api/doiRequestApi';

const StyledStatusBar = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 0.5rem;
  }
`;

const StyledStatusBarDescription = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

const StyledPublishedStatusIcon = styled(CheckCircleOutlineIcon)`
  color: green;
`;

const StyledUnpublishedStatusIcon = styled(WorkOutlineIcon)`
  color: orange;
`;

export const PublicPublicationStatusBar: FC<PublicPublicationContentProps> = ({ publication }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('publication');
  const user = useSelector((store: RootStore) => store.user);
  const {
    identifier,
    owner,
    status,
    entityDescription: {
      reference: { doi },
    },
    doiRequest,
  } = publication;

  const [messageToCurator, setMessageToCurator] = useState('');
  const [hasPendingDoiRequest, setHasPendingDoiRequest] = useState(doiRequest?.status === DoiRequestStatus.Requested);
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoadingDoiRequest, setIsLoadingDoiRequest] = useState(false);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);

  const sendDoiRequest = async () => {
    setIsLoadingDoiRequest(true);
    const createDoiRequestResponse = await createDoiRequest(identifier, messageToCurator);
    if (createDoiRequestResponse) {
      if (createDoiRequestResponse.error) {
        dispatch(setNotification(t('feedback:error.create_doi_request'), NotificationVariant.Error));
      } else {
        toggleRequestDoiModal();
        setHasPendingDoiRequest(true);
        dispatch(setNotification(t('feedback:success.doi_request_sent')));
      }
    }
    setIsLoadingDoiRequest(false);
  };

  const isOwner = owner === user?.id;
  const hasDoi = !!doi;

  return user?.isCreator && isOwner ? (
    <StyledStatusBar>
      <StyledStatusBarDescription>
        {status === PublicationStatus.PUBLISHED ? (
          <StyledPublishedStatusIcon fontSize="large" />
        ) : (
          <StyledUnpublishedStatusIcon fontSize="large" />
        )}
        <NormalText>
          {t('common:status')}: {t(`status.${status}`)}
        </NormalText>
      </StyledStatusBarDescription>
      <div>
        {!hasDoi &&
          (hasPendingDoiRequest ? (
            <Button variant="contained" color="primary" disabled>
              {t('public_page.requested_doi')}
            </Button>
          ) : (
            <>
              {status === PublicationStatus.PUBLISHED && (
                <Button variant="contained" color="primary" onClick={toggleRequestDoiModal}>
                  {t('public_page.request_doi')}
                </Button>
              )}
              {status === PublicationStatus.DRAFT && (
                <Button variant="contained" color="primary" disabled>
                  {t('public_page.reserve_doi')}
                </Button>
              )}
            </>
          ))}

        <Link to={`/publication/${identifier}`}>
          <Button variant="contained" color="primary">
            {t('edit_publication')}
          </Button>
        </Link>
      </div>

      {!hasDoi && (
        <Modal open={openRequestDoiModal} onClose={toggleRequestDoiModal} headingText={t('public_page.request_doi')}>
          <NormalText>{t('public_page.request_doi_description')}</NormalText>
          <TextField
            variant="outlined"
            multiline
            rows="4"
            fullWidth
            label={t('public_page.message_to_curator')}
            onChange={(event) => setMessageToCurator(event.target.value)}
          />
          <DialogActions>
            <Button onClick={toggleRequestDoiModal}>{t('common:cancel')}</Button>
            <ButtonWithProgress
              variant="contained"
              color="primary"
              onClick={sendDoiRequest}
              isLoading={isLoadingDoiRequest}>
              {t('common:send')}
            </ButtonWithProgress>
          </DialogActions>
        </Modal>
      )}
    </StyledStatusBar>
  ) : null;
};
