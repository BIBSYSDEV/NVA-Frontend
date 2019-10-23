import '../../styles/adminmenu.scss';
import { Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootStore } from '../../reducers/rootReducer';
import { useTranslation } from 'react-i18next';

const AdminMenu: React.FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const { t } = useTranslation();
  return (
    <>
      {user.id && (
        <div className="admin-menu">
          <div className="title">{t('Adminpanel')}</div>
          <Button>{t('New registration')}</Button>
        </div>
      )}
    </>
  );
};

export default AdminMenu;
