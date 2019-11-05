import '../../styles/pages/user.scss';

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
    <div className="user">
      <div className="secondary-info">
        <UserCard headerLabel="Bilde" className="profile-image" />
        <UserCard headerLabel={t('Contact')} className="contact-info" />
        <UserLanguage />
        <UserCard headerLabel={t('Author information')} className="author-info" />
      </div>

      <div className="primary-info">
        <UserInfo user={user} />
        <UserRoles user={user} />
        <UserCard headerLabel={t('Organizations')} className="organizations" />
        <UserOrcid />
      </div>
    </div>
  );
};

export default User;
