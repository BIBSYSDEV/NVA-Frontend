import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, IconButton, Typography, Link as MuiLink } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useHistory, useLocation } from 'react-router-dom';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModalContent from './OrcidModalContent';
import Card from '../../components/Card';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  removeQualifierIdFromAuthority,
  AuthorityQualifiers,
  addQualifierIdForAuthority,
} from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { setAuthorityData } from '../../redux/actions/userActions';
import Modal from '../../components/Modal';
import { StyledNormalTextPreWrapped } from '../../components/styled/Wrappers';
import { User } from '../../types/user.types';
import DangerButton from '../../components/DangerButton';
import { getOrcidInfo } from '../../api/external/orcidApi';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledOrcidLine = styled.div`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: 2fr 1fr;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text' 'button';
    grid-template-columns: 1fr;
  }
`;

const StyledButton = styled(DangerButton)`
  justify-self: right;
`;

const StyledLine = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

interface UserOrcidProps {
  user: User;
}

export const UserOrcid = ({ user }: UserOrcidProps) => {
  const { t } = useTranslation('profile');
  const listOfOrcids = user.authority ? user.authority.orcids : [];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingOrcid, setIsAddingOrcid] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  useEffect(() => {
    const addOrcid = async (accessToken: string) => {
      setIsAddingOrcid(true);
      const orcidInfoResponse = await getOrcidInfo(accessToken);
      const orcidId = orcidInfoResponse.data.id;

      if (!orcidId) {
        dispatch(setNotification(t('feedback:error.get_orcid', NotificationVariant.Error)));
      } else if (user.authority && !user.authority.orcids.includes(orcidId)) {
        const updatedAuthority = await addQualifierIdForAuthority(
          user.authority.id,
          AuthorityQualifiers.ORCID,
          orcidId
        );
        if (updatedAuthority?.error) {
          dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
        } else {
          dispatch(setAuthorityData(updatedAuthority));
        }
      }
      history.push(UrlPathTemplate.MyProfile);
      setIsAddingOrcid(false);
    };

    const orcidAccessToken = new URLSearchParams(location.hash.replace('#', '?')).get('access_token');
    if (orcidAccessToken) {
      addOrcid(orcidAccessToken);
    }
  }, [t, dispatch, user.authority, location.hash, history]);

  useEffect(() => {
    const orcidError = new URLSearchParams(location.hash.replace('#', '?')).get('error');
    if (orcidError) {
      dispatch(setNotification(t(`feedback:error.orcid.${orcidError}`), NotificationVariant.Error));
    }
  }, [location.hash, dispatch, t]);

  const removeOrcid = async (id: string) => {
    if (!user.authority) {
      return;
    }
    setIsRemovingOrcid(true);
    const updatedAuthority = await removeQualifierIdFromAuthority(user.authority.id, AuthorityQualifiers.ORCID, id);
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.delete_identifier')));
    }
    toggleConfirmDialog();
  };

  return (
    <Card>
      <Typography variant="h2">{t('orcid.orcid')}</Typography>
      {isAddingOrcid ? (
        <Skeleton width="50%" />
      ) : listOfOrcids.length > 0 ? (
        listOfOrcids.map((orcid) => (
          <StyledOrcidLine key={orcid} data-testid="orcid-line">
            <StyledLine>
              <IconButton size="small" href={orcid}>
                <img src={orcidIcon} height="20" alt="orcid" />
              </IconButton>
              <Typography
                data-testid="orcid-info"
                component={MuiLink}
                href={orcid}
                target="_blank"
                rel="noopener noreferrer">
                {orcid}
              </Typography>
            </StyledLine>

            <StyledButton
              data-testid="button-confirm-delete-orcid"
              onClick={toggleConfirmDialog}
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="secondary">
              {t('common:remove')}
            </StyledButton>

            <ConfirmDialog
              open={openConfirmDialog}
              title={t('orcid.remove_connection')}
              onAccept={() => removeOrcid(orcid)}
              onCancel={toggleConfirmDialog}
              isLoading={isRemovingOrcid}
              dataTestId="confirm-remove-orcid-connection-dialog">
              <StyledNormalTextPreWrapped>
                {t('orcid.remove_connection_info')}{' '}
                <MuiLink href={ORCID_BASE_URL} target="_blank" rel="noopener noreferrer">
                  {ORCID_BASE_URL}
                </MuiLink>
              </StyledNormalTextPreWrapped>
            </ConfirmDialog>
          </StyledOrcidLine>
        ))
      ) : (
        <>
          <Typography paragraph>{t('orcid.orcid_description')}</Typography>
          <Button
            color="secondary"
            data-testid="button-create-connect-orcid"
            onClick={toggleModal}
            variant="contained"
            size="small">
            {t('orcid.connect_orcid')}
          </Button>
          <Modal
            headingIcon={{ src: orcidIcon, alt: 'ORCID iD icon' }}
            headingText={t('orcid.dialog.heading')}
            onClose={toggleModal}
            open={openModal}
            dataTestId="orcid-modal">
            <OrcidModalContent cancelFunction={toggleModal} />
          </Modal>
        </>
      )}
    </Card>
  );
};
