import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, Typography, Link as MuiLink, Box } from '@mui/material';
import { Skeleton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import { OrcidModalContent } from './OrcidModalContent';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { setNotification } from '../../redux/actions/notificationActions';
import { Modal } from '../../components/Modal';
import { User } from '../../types/user.types';
import { getOrcidInfo } from '../../api/external/orcidApi';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { BackgroundDiv } from '../../components/styled/Wrappers';

interface UserOrcidProps {
  user: User;
}

export const UserOrcid = ({ user }: UserOrcidProps) => {
  const { t } = useTranslation('profile');
  const listOfOrcids: string[] = useMemo(() => [], []);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingOrcid, setIsAddingOrcid] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const dispatch = useDispatch();
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
        dispatch(setNotification(t('feedback:error.get_orcid', 'error')));
      } else if (!listOfOrcids.includes(orcidId)) {
        // TODO: Add ORCID
      }
      history.push(UrlPathTemplate.MyProfile);
      setIsAddingOrcid(false);
    };

    const orcidAccessToken = new URLSearchParams(history.location.search).get('access_token');
    if (orcidAccessToken) {
      addOrcid(orcidAccessToken);
    }
  }, [t, dispatch, history, listOfOrcids]);

  useEffect(() => {
    const orcidError = new URLSearchParams(history.location.search).get('error');
    if (orcidError) {
      dispatch(setNotification(t(`feedback:error.orcid.${orcidError}`), 'error'));
    }
  }, [history.location.search, dispatch, t]);

  const removeOrcid = async (id: string) => {
    setIsRemovingOrcid(true);
    // TODO: Remove ORCID
    toggleConfirmDialog();
  };

  return (
    <BackgroundDiv>
      <Typography variant="h2">{t('orcid.orcid')}</Typography>
      {isAddingOrcid ? (
        <Skeleton width="50%" />
      ) : listOfOrcids.length > 0 ? (
        listOfOrcids.map((orcid) => (
          <Box
            key={orcid}
            data-testid="orcid-line"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              alignItems: 'center',
            }}>
            <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
              onAccept={() => removeOrcid(orcid)}
              onCancel={toggleConfirmDialog}
              isLoading={isRemovingOrcid}
              dataTestId="confirm-remove-orcid-connection-dialog">
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {t('orcid.remove_connection_info')}{' '}
                <MuiLink href={ORCID_BASE_URL} target="_blank" rel="noopener noreferrer">
                  {ORCID_BASE_URL}
                </MuiLink>
              </Typography>
            </ConfirmDialog>
          </Box>
        ))
      ) : (
        <>
          <Typography paragraph>{t('orcid.orcid_description')}</Typography>
          <Button
            data-testid="button-create-connect-orcid"
            onClick={toggleModal}
            variant="contained"
            size="small"
            disabled>
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
    </BackgroundDiv>
  );
};
