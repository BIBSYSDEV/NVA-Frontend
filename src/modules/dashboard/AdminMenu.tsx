import '../../styles/adminmenu.scss';
import { Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootStore } from '../../reducers/rootReducer';

const AdminMenu: React.FC = () => {
  const user = useSelector((state: RootStore) => state.user);

  return (
    <>
      {user.id && (
        <div className="admin-menu">
          <div className="title">Adminpanel</div>
          <Button>+ Registrering</Button>
        </div>
      )}
    </>
  );
};

export default AdminMenu;
