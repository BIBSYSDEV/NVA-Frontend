import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import { getOrcidInfo } from '../../api/orcid';
import { orcidSignInFailure } from '../../redux/actions/orcidActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import UserCard from './UserCard';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';
import { PrimaryUserInfo, SecondaryUserInfo, StyledUserPage } from './User.styles';

const User: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orcidCode = query.get('code') || '';
    const error = query.get('error') || '';
    if (error) {
      dispatch(orcidSignInFailure('ErrorMessage.ORCID login failed'));
      history.push('/user');
    } else if (orcidCode) {
      dispatch(getOrcidInfo(orcidCode));
      history.push('/user');
    }
  }, [t, history, location.search, dispatch]);

  const user = useSelector((state: RootStore) => state.user);

  return (
    <StyledUserPage>
      <SecondaryUserInfo>
        <UserCard headerLabel="Bilde" />
        <UserCard headerLabel={t('Contact')} />
        <UserLanguage />
        <UserCard headerLabel={t('Author information')} />
      </SecondaryUserInfo>

      <PrimaryUserInfo>
        <UserInfo user={user} />
        <UserRoles user={user} />
        <UserCard headerLabel={t('Organizations')} />
        <UserOrcid />
      </PrimaryUserInfo>
    </StyledUserPage>
  );
};

export default User;
