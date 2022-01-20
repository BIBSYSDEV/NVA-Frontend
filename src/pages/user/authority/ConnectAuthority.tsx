import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../../api/authorityApi';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { User } from '../../../types/user.types';
import { AuthorityList } from './AuthorityList';
import { NewAuthorityCard } from './NewAuthorityCard';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

interface ConnectAuthorityProps {
  user: User;
  handleCloseModal: () => void;
}

export const ConnectAuthority = ({ user, handleCloseModal }: ConnectAuthorityProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const [selectedArpId, setSelectedArpId] = useState('');
  const [openNewAuthorityCard, setOpenNewAuthorityCard] = useState(false);
  const [isUpdatingAuthority, setIsUpdatingAuthority] = useState(false);

  const toggleOpenNewAuthorityCard = () => {
    setOpenNewAuthorityCard(!openNewAuthorityCard);
  };

  const updateAuthorityForUser = async () => {
    let selectedAuthority = user.possibleAuthorities.find((authority) => authority.id === selectedArpId);

    if (selectedAuthority) {
      setIsUpdatingAuthority(true);

      if (!selectedAuthority.feideids.includes(user.id)) {
        const updatedAuthorityWithFeide = await addQualifierIdForAuthority(
          selectedArpId,
          AuthorityQualifiers.FeideId,
          user.id
        );
        if (isErrorStatus(updatedAuthorityWithFeide.status)) {
          dispatch(
            setNotification(
              t('feedback:error.update_authority', { qualifier: t(`common:${AuthorityQualifiers.OrgUnitId}`) }),
              'error'
            )
          );
        } else if (isSuccessStatus(updatedAuthorityWithFeide.status)) {
          selectedAuthority = updatedAuthorityWithFeide.data;
        }
      }

      if (user.cristinId && !selectedAuthority.orgunitids.includes(user.cristinId)) {
        const updatedAuthorityWithCristinId = await addQualifierIdForAuthority(
          selectedArpId,
          AuthorityQualifiers.OrgUnitId,
          user.cristinId
        );
        if (isErrorStatus(updatedAuthorityWithCristinId.status)) {
          dispatch(
            setNotification(
              t('feedback:error.update_authority', { qualifier: t(`common:${AuthorityQualifiers.OrgUnitId}`) }),
              'error'
            )
          );
        } else if (isSuccessStatus(updatedAuthorityWithCristinId.status)) {
          dispatch(setAuthorityData(updatedAuthorityWithCristinId.data));
        }
      } else {
        dispatch(setAuthorityData(selectedAuthority));
      }
    }
  };

  return (
    <>
      {user.possibleAuthorities.length > 0 && !openNewAuthorityCard ? (
        <>
          <AuthorityList
            authorities={user.possibleAuthorities}
            selectedArpId={selectedArpId}
            onSelectAuthority={(authority) => setSelectedArpId(authority.id)}
            searchTerm={user.name}
          />
          <StyledRightAlignedWrapper>
            <Button variant="text" data-testid="button-create-authority" onClick={toggleOpenNewAuthorityCard}>
              {t('authority.create_authority')}
            </Button>
          </StyledRightAlignedWrapper>

          <DialogActions>
            <Button variant="text" onClick={handleCloseModal}>
              {t('common:cancel')}
            </Button>
            <LoadingButton
              data-testid="connect-author-button"
              variant="contained"
              size="large"
              onClick={updateAuthorityForUser}
              disabled={!selectedArpId}
              loading={isUpdatingAuthority}>
              {t('authority.connect_to_select_authority')}
            </LoadingButton>
          </DialogActions>
        </>
      ) : (
        <NewAuthorityCard user={user} onClickCancel={toggleOpenNewAuthorityCard} />
      )}
    </>
  );
};
