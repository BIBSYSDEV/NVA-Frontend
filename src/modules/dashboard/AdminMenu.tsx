import '../../styles/adminmenu.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button } from '@material-ui/core';

import { RootStore } from '../../reducers/rootReducer';

const AdminMenu: React.FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const { t } = useTranslation();
  return (
    <>
      {user.id && (
        <div className="admin-menu">
          <div className="title">{t('Admin panel')}</div>
          <Button>{t('New registration')}</Button>
        </div>
      )}
    </>
  );
};

export default AdminMenu;
