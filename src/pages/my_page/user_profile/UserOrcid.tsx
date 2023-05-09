import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, IconButton, Typography, Link as MuiLink, Box, CircularProgress } from '@mui/material';
import { Skeleton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../utils/constants';
import { OrcidModalContent } from './OrcidModalContent';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { setNotification } from '../../../redux/notificationSlice';
import { Modal } from '../../../components/Modal';
import { User } from '../../../types/user.types';
import { getOrcidInfo } from '../../../api/external/orcidApi';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { getValueByKey } from '../../../utils/user-helpers';
import { fetchPerson } from '../../../api/cristinApi';
import { postOrcidCredentials } from '../../../api/orcidApi';
import { OrcidCredentials } from '../../../types/orcid.types';

interface UserOrcidProps {
  user: User;
}

const allPropertiesAreInCredentialsObject = (rawCredentials: { [p: string]: string }) =>
  'expires_in' in rawCredentials &&
  !isNaN(+rawCredentials['expires_in']) &&
  'id_token' in rawCredentials &&
  'persistent' in rawCredentials &&
  'tokenId' in rawCredentials &&
  !isNaN(+rawCredentials['tokenId']) &&
  'tokenVersion' in rawCredentials &&
  'token_type' in rawCredentials &&
  'access_token' in rawCredentials;

const getOrcidCredentials = (search: string, orcidUrl: string): OrcidCredentials | null => {
  const searchParams = new URLSearchParams(search);
  const rawCredentials = Object.fromEntries(searchParams);
  return allPropertiesAreInCredentialsObject(rawCredentials)
    ? {
        expiresIn: +rawCredentials['expires_in'],
        idToken: rawCredentials['id_token'],
        persistent: rawCredentials['persistent'].toLowerCase() === 'true',
        tokenId: +rawCredentials['tokenId'],
        tokenVersion: rawCredentials['tokenVersion'],
        tokenType: rawCredentials['token_type'],
        orcid: orcidUrl,
        accessToken: rawCredentials['access_token'],
      }
    : null;
};

export const UserOrcid = ({ user }: UserOrcidProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingOrcid, setIsAddingOrcid] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const userCristinId = user.cristinId ?? '';

  const cristinPersonQuery = useQuery({
    enabled: !!userCristinId,
    queryKey: [userCristinId],
    queryFn: () => fetchPerson(userCristinId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });
  const cristinPerson = cristinPersonQuery.data;

  const currentOrcid = getValueByKey('ORCID', cristinPerson?.identifiers);
  const orcidUrl = `${ORCID_BASE_URL}/${currentOrcid}`;

  const toggleModal = () => setOpenModal(!openModal);
  const toggleConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  useEffect(() => {
    const addOrcid = async (accessToken: string) => {
      setIsAddingOrcid(true);
      const orcidInfoResponse = await getOrcidInfo(accessToken);
      const orcid = orcidInfoResponse.data.sub;

      if (!orcid) {
        dispatch(setNotification({ message: t('feedback.error.get_orcid'), variant: 'error' }));
      } else if (userCristinId) {
        const addOrcidResponse = await authenticatedApiRequest({
          url: userCristinId,
          method: 'PATCH',
          data: { orcid },
        });
        if (isSuccessStatus(addOrcidResponse.status)) {
          dispatch(setNotification({ message: t('feedback.success.update_orcid'), variant: 'success' }));
          const orcidCredentials = getOrcidCredentials(history.location.search, orcidInfoResponse.data.id);
          if (!orcidCredentials) {
            dispatch(setNotification({ message: t('feedback.error.storing_orcid_credentials'), variant: 'error' }));
          } else {
            const postOrcidCredentialsResponse = await postOrcidCredentials(orcidCredentials);
            if (isErrorStatus(postOrcidCredentialsResponse.status)) {
              dispatch(setNotification({ message: t('feedback.error.storing_orcid_credentials'), variant: 'error' }));
            }
          }
        } else if (isErrorStatus(addOrcidResponse.status)) {
          dispatch(setNotification({ message: t('feedback.error.update_orcid'), variant: 'error' }));
        }
      }
      setIsAddingOrcid(false);
      history.replace(UrlPathTemplate.MyPageMyPersonalia + '?refresh=true');
    };

    const orcidAccessToken = new URLSearchParams(history.location.search).get('access_token');
    if (orcidAccessToken) {
      addOrcid(orcidAccessToken);
    }
    const orcidError = new URLSearchParams(history.location.search).get('error');
    if (orcidError) {
      dispatch(setNotification({ message: t('feedback.error.orcid_login'), variant: 'error' }));
    }
  }, [dispatch, t, history, userCristinId]);

  useEffect(() => {
    const fetchUser = async () => {
      await cristinPersonQuery.refetch();
      history.replace(UrlPathTemplate.MyPageMyPersonalia);
    };
    const refresh = new URLSearchParams(history.location.search).get('refresh');
    if (refresh) {
      fetchUser();
    }
  }, [cristinPersonQuery, history]);

  const removeOrcid = async () => {
    setIsRemovingOrcid(true);
    if (userCristinId) {
      const removeOrcidResponse = await authenticatedApiRequest({
        url: userCristinId,
        method: 'PATCH',
        data: { orcid: null },
      });
      if (isSuccessStatus(removeOrcidResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_orcid'), variant: 'success' }));
        cristinPersonQuery.refetch();
      } else if (isErrorStatus(removeOrcidResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_orcid'), variant: 'success' }));
      }
    }
    toggleConfirmDialog();
  };

  return (
    <div>
      {cristinPersonQuery.isLoading ? (
        <CircularProgress aria-labelledby="orcid-label" />
      ) : isAddingOrcid ? (
        <Skeleton width="50%" />
      ) : currentOrcid ? (
        <Box
          data-testid="orcid-line"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
            alignItems: 'center',
          }}>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
            <IconButton size="small" href={orcidUrl}>
              <img src={orcidIcon} height="20" alt={t('common.orcid')} />
            </IconButton>
            <Typography
              data-testid="orcid-info"
              component={MuiLink}
              href={orcidUrl}
              target="_blank"
              rel="noopener noreferrer">
              {currentOrcid}
            </Typography>
            <IconButton
              color="primary"
              data-testid="button-confirm-delete-orcid"
              onClick={toggleConfirmDialog}
              title={t('my_page.my_profile.orcid.delete_orcid')}>
              <CancelIcon />
            </IconButton>
          </Box>

          <ConfirmDialog
            open={openConfirmDialog}
            title={t('my_page.my_profile.orcid.remove_connection')}
            onAccept={removeOrcid}
            onCancel={toggleConfirmDialog}
            isLoading={isRemovingOrcid}
            dialogDataTestId="confirm-remove-orcid-connection-dialog">
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {t('my_page.my_profile.orcid.remove_connection_info')}{' '}
              <MuiLink href={orcidUrl} target="_blank" rel="noopener noreferrer">
                {orcidUrl}
              </MuiLink>
            </Typography>
          </ConfirmDialog>
        </Box>
      ) : (
        <>
          <Typography paragraph>{t('my_page.my_profile.orcid.orcid_description')}</Typography>
          <Button data-testid="button-create-connect-orcid" onClick={toggleModal} variant="contained" size="small">
            {t('my_page.my_profile.orcid.connect_orcid')}
          </Button>
          <Modal
            headingIcon={{ src: orcidIcon, alt: 'ORCID iD icon' }}
            headingText={t('my_page.my_profile.orcid.dialog.heading')}
            onClose={toggleModal}
            open={openModal}
            dataTestId="orcid-modal">
            <OrcidModalContent cancelFunction={toggleModal} />
          </Modal>
        </>
      )}
    </div>
  );
};
