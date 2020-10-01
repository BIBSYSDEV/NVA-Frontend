import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { RootStore } from '../../redux/reducers/rootReducer';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModalContent from './OrcidModalContent';
import Card from '../../components/Card';
import { Button, IconButton, Typography } from '@material-ui/core';
import ConfirmDialog from '../../components/ConfirmDialog';
import { removeQualifierIdFromAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { setAuthorityData } from '../../redux/actions/userActions';
import { setExternalOrcid } from '../../redux/actions/orcidActions';
import Modal from '../../components/Modal';
import { Link as MuiLink } from '@material-ui/core';
import { StyledNormalTextPreWrapped } from '../../components/styled/Wrappers';
import { useLocation } from 'react-router-dom';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const StyledOrcidLine = styled.div`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: 2fr 1fr;
  align-items: center;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text' 'button';
    grid-template-columns: 1fr;
  }
`;

const StyledButton = styled(Button)`
  justify-self: right;
`;

const StyledLine = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const StyledContent = styled.div`
  flex: 1;
`;

const StyledLabel = styled(Typography)`
  width: 6rem;
  min-width: 6rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation('profile');
  const authority = useSelector((state: RootStore) => state.user.authority);
  const listOfOrcids = authority ? authority.orcids : [];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isRemovingOrcid, setIsRemovingOrcid] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  useEffect(() => {
    const orcidError = new URLSearchParams(location.hash.replace('#', '?')).get('error');
    if (orcidError) {
      dispatch(setNotification(t(`feedback:error.orcid.${orcidError}`), NotificationVariant.Error));
    }
  }, [location.hash, dispatch, t]);

  const removeOrcid = async (id: string) => {
    if (!authority) {
      return;
    }
    setIsRemovingOrcid(true);
    const updatedAuthority = await removeQualifierIdFromAuthority(
      authority.systemControlNumber,
      AuthorityQualifiers.ORCID,
      id
    );
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setExternalOrcid(''));
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.delete_identifier')));
    }
    toggleConfirmDialog();
  };

  return (
    <Card>
      <Typography variant="h5">{t('common:orcid')}</Typography>
      {listOfOrcids?.length > 0 ? (
        listOfOrcids.map((orcid: string) => {
          const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
          return (
            <StyledOrcidLine key={orcid}>
              <StyledLine>
                <StyledLabel>{t('orcid.your_orcid')}:</StyledLabel>
                <IconButton size="small" href={orcidLink} key={orcid}>
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
                <MuiLink href={orcidLink} target="_blank" rel="noopener noreferrer">
                  <StyledContent data-testid="orcid-info">
                    <Typography>{orcidLink}</Typography>
                  </StyledContent>
                </MuiLink>
              </StyledLine>

              <StyledButton
                data-testid="button-confirm-delete-orcid"
                onClick={toggleConfirmDialog}
                variant="outlined"
                color="secondary">
                <DeleteIcon />
                {t('common:remove')}
              </StyledButton>

              <ConfirmDialog
                open={openConfirmDialog}
                title={t('orcid.remove_connection')}
                onAccept={() => removeOrcid(orcid)}
                onCancel={toggleConfirmDialog}
                isLoading={isRemovingOrcid}>
                <StyledNormalTextPreWrapped>
                  {t('orcid.remove_connection_info')}{' '}
                  <MuiLink href={ORCID_BASE_URL} target="_blank" rel="noopener noreferrer">
                    {ORCID_BASE_URL}
                  </MuiLink>
                </StyledNormalTextPreWrapped>
              </ConfirmDialog>
            </StyledOrcidLine>
          );
        })
      ) : (
        <>
          <StyledInformation>{t('profile:orcid.description_why_use_orcid')}</StyledInformation>
          <Button
            color="primary"
            data-testid="button-create-connect-orcid"
            onClick={toggleModal}
            variant="contained"
            size="small">
            {t('profile:orcid.create_or_connect')}
          </Button>
          <Modal
            headingIcon={{ src: orcidIcon, alt: 'ORCID iD icon' }}
            headingText={t('profile:orcid.create_or_connect')}
            onClose={toggleModal}
            open={openModal}>
            <OrcidModalContent />
          </Modal>
        </>
      )}
    </Card>
  );
};

export default UserOrcid;
