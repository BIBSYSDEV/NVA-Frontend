import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, Typography, Link as MuiLink, Box, CircularProgress } from '@mui/material';
import { Skeleton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../utils/constants';
import { OrcidModalContent } from './OrcidModalContent';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { setNotification } from '../../../redux/notificationSlice';
import { Modal } from '../../../components/Modal';
import { CristinPerson, User } from '../../../types/user.types';
import { getOrcidInfo } from '../../../api/external/orcidApi';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getValueByKey } from '../../../utils/user-helpers';

interface UserOrcidProps {
  user: User;
}

export const UserOrcid = ({ user }: UserOrcidProps) => {
  const { t } = useTranslation('myPage');
  const dispatch = useDispatch();
  const history = useHistory();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingOrcid, setIsAddingOrcid] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const userCristinId = user.cristinId ?? '';
  const [cristinPerson, isLoadingCristinPerson, refetchCristinPerson] = useFetch<CristinPerson>({
    url: userCristinId,
    errorMessage: t('feedback:error.get_person'),
  });
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
        dispatch(setNotification({ message: t('feedback:error.get_orcid'), variant: 'error' }));
      } else if (userCristinId) {
        const addOrcidResponse = await authenticatedApiRequest({
          url: userCristinId,
          method: 'PATCH',
          data: { orcid },
        });
        if (isSuccessStatus(addOrcidResponse.status)) {
          dispatch(setNotification({ message: t('feedback:success.update_orcid'), variant: 'success' }));
          refetchCristinPerson();
        } else if (isErrorStatus(addOrcidResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.update_orcid'), variant: 'success' }));
        }
      }
      history.push(UrlPathTemplate.MyPageMyProfile);
      setIsAddingOrcid(false);
    };

    const orcidAccessToken = new URLSearchParams(history.location.search).get('access_token');
    if (orcidAccessToken) {
      addOrcid(orcidAccessToken);
    }
  }, [t, dispatch, history, userCristinId, refetchCristinPerson]);

  useEffect(() => {
    const orcidError = new URLSearchParams(history.location.search).get('error');
    if (orcidError) {
      dispatch(setNotification({ message: t(`feedback:error.orcid.${orcidError}`), variant: 'error' }));
    }
  }, [history.location.search, dispatch, t]);

  const removeOrcid = async () => {
    setIsRemovingOrcid(true);
    if (userCristinId) {
      const removeOrcidResponse = await authenticatedApiRequest({
        url: userCristinId,
        method: 'PATCH',
        data: { orcid: null },
      });
      if (isSuccessStatus(removeOrcidResponse.status)) {
        dispatch(setNotification({ message: t('feedback:success.update_orcid'), variant: 'success' }));
        refetchCristinPerson();
      } else if (isErrorStatus(removeOrcidResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.update_orcid'), variant: 'success' }));
      }
    }
    toggleConfirmDialog();
  };

  return (
    <div>
      <Typography variant="h2">{t('my_profile.orcid.orcid')}</Typography>
      {isLoadingCristinPerson ? (
        <CircularProgress />
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
          <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <IconButton size="small" href={orcidUrl}>
              <img src={orcidIcon} height="20" alt="orcid" />
            </IconButton>
            <Typography
              data-testid="orcid-info"
              component={MuiLink}
              href={orcidUrl}
              target="_blank"
              rel="noopener noreferrer">
              {orcidUrl}
            </Typography>
          </Box>

          <Button
            color="error"
            data-testid="button-confirm-delete-orcid"
            onClick={toggleConfirmDialog}
            startIcon={<DeleteIcon />}
            variant="outlined">
            {t('common:remove')}
          </Button>

          <ConfirmDialog
            open={openConfirmDialog}
            title={t('orcid.remove_connection')}
            onAccept={removeOrcid}
            onCancel={toggleConfirmDialog}
            isLoading={isRemovingOrcid}
            dataTestId="confirm-remove-orcid-connection-dialog">
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {t('my_profile.orcid.remove_connection_info')}{' '}
              <MuiLink href={orcidUrl} target="_blank" rel="noopener noreferrer">
                {orcidUrl}
              </MuiLink>
            </Typography>
          </ConfirmDialog>
        </Box>
      ) : (
        <>
          <Typography paragraph>{t('orcid.orcid_description')}</Typography>
          <Button data-testid="button-create-connect-orcid" onClick={toggleModal} variant="contained" size="small">
            {t('my_profile.orcid.connect_orcid')}
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
    </div>
  );
};
