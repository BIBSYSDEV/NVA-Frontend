import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button, Radio } from '@material-ui/core';

import { mockSingleAuthorityResponseWithFeide } from '../../../api/mock-interceptor';
import Progress from '../../../components/Progress';
import { addNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { USE_MOCK_DATA } from '../../../utils/constants';
import { createAuthority } from '../../../api/authorityApi';

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
  height: 16rem;
`;

const StyledAuthority = styled.div`
  grid-area: authority;
`;

const StyledDescription = styled.div`
  grid-area: description;
  margin-left: 0.7rem;
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

const NewAuthorityCard: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('profile');

  const handleCreateAuthority = async () => {
    setLoading(true);
    const authority = await createAuthority(`${user.familyName},${user.givenName}`);
    if (authority) {
      setLoading(false);
      dispatch(setAuthorityData(authority));
      dispatch(addNotification('authority.created_authority'));
    }
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setLoading(false);
        dispatch(setAuthorityData(mockSingleAuthorityResponseWithFeide));
        dispatch(addNotification('authority.created_authority', 'error'));
      }, [2000]);
    }
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
          <StyledDescription>{t('authority.description_no_authority_found')}</StyledDescription>
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
