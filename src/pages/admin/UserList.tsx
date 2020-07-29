import React, { FC, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@material-ui/core';
import Label from './../../components/Label';
import { useTranslation } from 'react-i18next';
import { UserAdmin, RoleName } from '../../types/user.types';
import { assignUserRole } from '../../api/roleApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledButton = styled(StyledNewButton)`
  margin-left: 0.5rem;
`;

interface UserListProps {
  userList: UserAdmin[];
  role: RoleName;
  buttonText: string;
}

const UserList: FC<UserListProps> = ({ userList, role, buttonText }) => {
  const { t } = useTranslation('admin');
  const [newUser, setNewUser] = useState(false);
  const [username, setUsername] = useState('');
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();

  const toggleNewUser = () => {
    setNewUser(!newUser);
  };

  const handleSubmitUser = async () => {
    const newUserRole = await assignUserRole(user.organizationId, username, role);
    if (newUserRole) {
      if (newUserRole.error) {
        dispatch(setNotification(newUserRole.error, NotificationVariant.Error));
      } else if (newUserRole.info) {
        dispatch(setNotification(newUserRole.info, NotificationVariant.Info));
      } else {
        dispatch(setNotification(t('feedback:success.added_role')));
      }
    }
    toggleNewUser();
  };

  const handleAddNewUser = (event: ChangeEvent<any>) => {
    setUsername(event.target.value);
  };

  return (
    <>
      {(userList?.length > 0 || newUser) && (
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>
                <Label>{t('users.username')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('common:name')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('users.created_date')}</Label>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.createdDate}</TableCell>
                <TableCell align="right">
                  <Button disabled color="secondary" variant="contained">
                    {t('common:delete')}
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
            {newUser && (
              <StyledTableRow>
                <TableCell>
                  <TextField label={t('users.username')} variant="outlined" size="small" onChange={handleAddNewUser} />
                </TableCell>
                <TableCell colSpan={4} align="right">
                  <StyledButton color="primary" variant="contained" onClick={handleSubmitUser}>
                    {t('common:add')}
                  </StyledButton>
                  <StyledButton color="secondary" variant="contained" onClick={toggleNewUser}>
                    {t('common:cancel')}
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      )}
      <StyledNewButton color="primary" variant="outlined" onClick={toggleNewUser} disabled={newUser}>
        {buttonText}
      </StyledNewButton>
    </>
  );
};

export default UserList;
