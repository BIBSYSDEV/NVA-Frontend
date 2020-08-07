import React, { FC, useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@material-ui/core';
import Label from './../../components/Label';
import { useTranslation } from 'react-i18next';
import { InstitutionUser, RoleName } from '../../types/user.types';
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
  userList: InstitutionUser[];
  role: RoleName;
  buttonText: string;
}

const UserList: FC<UserListProps> = ({ userList, role, buttonText }) => {
  const { t } = useTranslation('admin');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUserList, setCurrentUserList] = useState(userList);
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentUserList(userList);
  }, [userList]);

  const toggleShowNewUserForm = () => {
    setShowNewUserForm(!showNewUserForm);
  };

  const handleSubmitUser = async () => {
    const newUserRole = await assignUserRole(user.institution, username, role);
    if (newUserRole) {
      if (newUserRole.error) {
        dispatch(setNotification(newUserRole.error, NotificationVariant.Error));
      } else if (newUserRole.info) {
        dispatch(setNotification(newUserRole.info, NotificationVariant.Info));
      } else {
        setCurrentUserList([...currentUserList, newUserRole]);
        dispatch(setNotification(t('feedback:success.added_role')));
      }
    }
    toggleShowNewUserForm();
  };

  const handleAddNewUser = (event: ChangeEvent<any>) => {
    setUsername(event.target.value);
  };

  return (
    <>
      {(currentUserList?.length > 0 || showNewUserForm) && (
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>
                <Label>{t('users.username')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('common:institution')}</Label>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUserList.map((user) => (
              <StyledTableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.institution}</TableCell>
                <TableCell align="right">
                  <Button disabled color="secondary" variant="contained">
                    {t('common:delete')}
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
            {showNewUserForm && (
              <StyledTableRow>
                <TableCell>
                  <TextField label={t('users.username')} variant="outlined" size="small" onChange={handleAddNewUser} />
                </TableCell>
                <TableCell colSpan={4} align="right">
                  <StyledButton color="primary" variant="contained" onClick={handleSubmitUser}>
                    {t('common:add')}
                  </StyledButton>
                  <StyledButton color="secondary" variant="contained" onClick={toggleShowNewUserForm}>
                    {t('common:cancel')}
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      )}
      <StyledNewButton color="primary" variant="outlined" onClick={toggleShowNewUserForm} disabled={showNewUserForm}>
        {buttonText}
      </StyledNewButton>
    </>
  );
};

export default UserList;
