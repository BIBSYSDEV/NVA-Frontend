import '../../styles/adminmenu.scss';
import { Button } from '@material-ui/core';
import React from 'react';

const AdminMenu: React.FC = () => (
  <div className="admin-menu">
    <div className="title">Adminpanel</div>
    <Button>+ Registrering</Button>
  </div>
);

export default AdminMenu;
