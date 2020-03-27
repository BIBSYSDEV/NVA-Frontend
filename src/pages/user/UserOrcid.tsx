import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';

import ButtonModal from '../../components/ButtonModal';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModal from './OrcidModal';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { Avatar, Button } from '@material-ui/core';
import ConfirmDialog from '../../components/ConfirmDialog';
import { removeQualifierIdFromAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { setAuthorityData } from '../../redux/actions/userActions';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const StyledOrcidLine = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
`;

const StyledButton = styled(Button)`
  justify-content: flex-end;
`;

const StyledAvatar = styled(Avatar)`
  display: inline-flex;
  margin-right: 0.5rem;
  top: 0.5rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation('profile');
  const user = useSelector((state: RootStore) => state.user);
  const listOfOrcids = user.authority?.orcids;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const dispatch = useDispatch();

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const removeOrcid = async (id: string) => {
    const updatedAuthority = await removeQualifierIdFromAuthority(
      user.authority.systemControlNumber,
      AuthorityQualifiers.ORCID,
      id
    );
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
      <Heading>
        <StyledAvatar src={orcidIcon} alt="ORCID icon" />
        {t('common:orcid')}
      </Heading>
      {listOfOrcids?.length > 0 ? (
        listOfOrcids.map((orcid: string) => {
          const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
          return (
            <StyledOrcidLine key={orcid}>
              <LabelTextLine
                dataTestId={'orcid-info'}
                label={t('orcid.your_orcid')}
                text={orcidLink}
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
          <ButtonModal
            buttonText={t('profile:orcid.create_or_connect')}
            dataTestId="open-orcid-modal"
            headingText={t('profile:orcid.create_or_connect')}>
            <OrcidModal />
          </ButtonModal>
        </>
      )}
    </Card>
  );
};

export default UserOrcid;
