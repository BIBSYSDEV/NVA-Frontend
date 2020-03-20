import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button, Radio } from '@material-ui/core';
import Progress from '../../../components/Progress';
import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { createAuthority } from '../../../api/authorityApi';
import { NotificationVariant } from '../../../types/notification.types';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-areas:
    'authority authority authority'
    'description description description'
    '. . create-button';
  grid-template-columns: 1fr 3fr 3fr;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;
  align-items: center;
`;

const StyledAuthority = styled.div`
  grid-area: authority;
`;

const StyledDescription = styled.div`
  grid-area: description;
  margin-left: 0.7rem;
  white-space: pre-wrap;
`;

const StyledButton = styled(Button)`
  grid-area: create-button;
  margin-top: 2rem;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 36rem;
  height: 16rem;
  padding: 2rem;
`;

interface NewAuthorityCardProps {
  description: string;
}

const NewAuthorityCard: FC<NewAuthorityCardProps> = ({ description }) => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('profile');

  const handleCreateAuthority = async () => {
    setLoading(true);
    const authority = await createAuthority(user);
    if (authority?.error) {
      dispatch(setNotification(authority.error, NotificationVariant.Error));
    } else {
      dispatch(setAuthorityData(authority));
      dispatch(setNotification(t('feedback:success.created_authority')));
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <StyledProgressContainer>
          <Progress size={100} />
        </StyledProgressContainer>
      ) : (
        <StyledBoxContent>
          <StyledAuthority>
            <Radio color="primary" checked />
            {user.name}
          </StyledAuthority>
          <StyledDescription>{description}</StyledDescription>
          <StyledButton
            data-testid="create-author-button"
            color="primary"
            variant="contained"
            size="large"
            onClick={handleCreateAuthority}>
            {t('authority.create_authority')}
          </StyledButton>
        </StyledBoxContent>
      )}
    </>
  );
};

export default NewAuthorityCard;
