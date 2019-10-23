import '../../styles/user.scss';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getOrcidInfo } from '../../api/user';
import { RootStore } from '../../reducers/rootReducer';
import UserCard from './UserCard';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';

const User: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orcidCode = query.get('code') || '';
    if (orcidCode) {
      dispatch(getOrcidInfo(orcidCode));
    }
  }, [location.search, dispatch]);

  const user = useSelector((state: RootStore) => state.user);

  return (
    <div className="user">
      <div className="secondary-info">
        <UserCard headerLabel="Bilde" className="user__profile-image" />
        <UserCard headerLabel={t('Contact')} className="user__contact-info" />
        <UserLanguage />
        <UserCard headerLabel={t('Author information')} className="user__author-info" />
      </div>

      <div className="primary-info">
        <UserInfo user={user} />
        <UserRoles user={user} />
        <UserCard headerLabel={t('Organizations')} className="user__organizations" />
        <UserOrcid />
      </div>
    </div>
  );
};

export default User;
