import CancelIcon from '@mui/icons-material/Cancel';
import { Box, CircularProgress, IconButton, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { fetchPerson } from '../../../api/cristinApi';
import { getOrcidInfo } from '../../../api/external/orcidApi';
import { postOrcidCredentials } from '../../../api/orcidApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { LinkButton } from '../../../components/PageWithSideMenu';
import { setNotification } from '../../../redux/notificationSlice';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { OrcidCredentials } from '../../../types/orcid.types';
import { User } from '../../../types/user.types';
import { ORCID_BASE_URL, isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { getValueByKey } from '../../../utils/user-helpers';

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

  const [isAddingOrcid, setIsAddingOrcid] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const userCristinId = user.cristinId ?? '';

  const cristinPersonQuery = useQuery({
    enabled: !!userCristinId,
    queryKey: [userCristinId],
    queryFn: () => fetchPerson(userCristinId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
  const fetchCristinPersonRef = useRef(cristinPersonQuery.refetch);
  const cristinPerson = cristinPersonQuery.data;

  const currentOrcid = getValueByKey('ORCID', cristinPerson?.identifiers);
  const orcidUrl = `${ORCID_BASE_URL}/${currentOrcid}`;

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
          await fetchCristinPersonRef.current();
          const orcidCredentials = getOrcidCredentials(history.location.search, orcidInfoResponse.data.id);
          if (!orcidCredentials) {
            dispatch(setNotification({ message: t('feedback.error.storing_orcid_credentials'), variant: 'error' }));
          } else {
            const postOrcidCredentialsResponse = await postOrcidCredentials(orcidCredentials);
            if (postOrcidCredentialsResponse.status !== 409 && isErrorStatus(postOrcidCredentialsResponse.status)) {
              // Ignore 409 Conflict, since this means that the data is correct anyway
              dispatch(setNotification({ message: t('feedback.error.storing_orcid_credentials'), variant: 'error' }));
            }
          }
        } else if (isErrorStatus(addOrcidResponse.status)) {
          dispatch(setNotification({ message: t('feedback.error.update_orcid'), variant: 'error' }));
        }
      }
      setIsAddingOrcid(false);
      history.replace({
        search: '',
      });
    };

    const searchParams = new URLSearchParams(history.location.search);

    const orcidAccessToken = searchParams.get('access_token');
    if (orcidAccessToken) {
      addOrcid(orcidAccessToken);
    }
    const orcidError = searchParams.get('error');
    if (orcidError) {
      dispatch(setNotification({ message: t('feedback.error.orcid_login'), variant: 'error' }));
    }
  }, [dispatch, t, history, userCristinId]);

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
        await cristinPersonQuery.refetch();
      } else if (isErrorStatus(removeOrcidResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_orcid'), variant: 'success' }));
      }
    }
    toggleConfirmDialog();
  };

  return (
    <div>
      {cristinPersonQuery.isPending ? (
        <CircularProgress aria-labelledby="orcid-label" />
      ) : isAddingOrcid ? (
        <Skeleton width="20rem" />
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
              {orcidUrl}
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
        <LinkButton
          endIcon={<img src={orcidIcon} height="20" alt="" />}
          data-testid="button-create-connect-orcid"
          href={`${ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=token&scope=openid&redirect_uri=${window.location.href}`}
          size="small">
          {t('my_page.my_profile.orcid.connect_orcid')}
        </LinkButton>
      )}
    </div>
  );
};
