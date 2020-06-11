import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModalContent from './OrcidModalContent';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { Avatar, Button } from '@material-ui/core';
import ConfirmDialog from '../../components/ConfirmDialog';
import { removeQualifierIdFromAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { setAuthorityData } from '../../redux/actions/userActions';
import { setExternalOrcid } from '../../redux/actions/orcidActions';
import Modal from '../../components/Modal';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const StyledOrcidLine = styled.div`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text' 'button';
    grid-template-columns: 1fr;
  }
`;

// const StyledAvatar = styled(Avatar)`
//   display: inline-flex;
//   margin-right: 0.5rem;
//   top: 0.5rem;
// `;

const StyledButton = styled(Button)`
  justify-self: right;
`;

const StyledHeadingWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StyledHeading = styled(Heading)`
  margin: 0 1rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation('profile');
  const authority = useSelector((state: RootStore) => state.user.authority);
  const listOfOrcids = authority ? authority.orcids : [];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const removeOrcid = async (id: string) => {
    if (!authority) {
      return;
    }
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
      <StyledHeadingWrapper>
        <Avatar src={orcidIcon} alt="ORCID icon" />
        <StyledHeading>{t('common:orcid')}</StyledHeading>
      </StyledHeadingWrapper>
      {listOfOrcids?.length > 0 ? (
        listOfOrcids.map((orcid: string) => {
          const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
          return (
            <StyledOrcidLine key={orcid}>
              <LabelTextLine
                dataTestId={'orcid-info'}
                label={t('orcid.your_orcid')}
                linkText={orcidLink}
                externalLink={orcidLink}
              />
              <StyledButton onClick={toggleConfirmDialog} variant="contained" color="secondary">
                <DeleteIcon />
                {t('orcid.remove_connection')}
              </StyledButton>

              <ConfirmDialog
                open={openConfirmDialog}
                title={t('orcid.remove_connection')}
                text={t('orcid.remove_connection_text')}
                onAccept={() => removeOrcid(orcid)}
                onCancel={toggleConfirmDialog}
              />
            </StyledOrcidLine>
          );
        })
      ) : (
        <>
          <StyledInformation>{t('profile:orcid.description_why_use_orcid')}</StyledInformation>
          <Button color="primary" onClick={toggleModal} variant="contained">
            {t('profile:orcid.create_or_connect')}
          </Button>
          <Modal
            headingIcon={{ src: orcidIcon, alt: 'ORCID iD icon' }}
            headingText={t('profile:orcid.create_or_connect')}
            onClose={toggleModal}
            openModal={openModal}>
            <OrcidModalContent />
          </Modal>
        </>
      )}
    </Card>
  );
};

export default UserOrcid;
