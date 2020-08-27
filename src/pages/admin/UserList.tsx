import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TablePagination } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import Label from './../../components/Label';
import { InstitutionUser, RoleName } from '../../types/user.types';
import NormalText from '../../components/NormalText';
import { addRoleToUser, removeRoleFromUser } from '../../api/roleApi';
import { useDispatch } from 'react-redux';
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

interface UserListProps {
  userList: InstitutionUser[];
  roleToRemove?: RoleName;
  roleToAdd?: RoleName;
  refetchUsers?: () => void;
  alwaysShowPagination?: boolean; // If false, show pagination only if more elements than minimum rows per page
}

const rowsPerPageOptions = [5, 10, 25];

const UserList: FC<UserListProps> = ({
  userList,
  roleToRemove,
  roleToAdd,
  refetchUsers,
  alwaysShowPagination = false,
}) => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Move to first page if userList change due to e.g. filtering
    setPage(0);
  }, [userList]);

  const handleAddRoleToUser = async (username: string) => {
    if (roleToAdd) {
      const response = await addRoleToUser(username, roleToAdd);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('feedback:error.add_role'), NotificationVariant.Error));
        } else {
          dispatch(setNotification(t('feedback:success.added_role')));
          refetchUsers && refetchUsers();
        }
      }
    }
  };

  const handleRemoveRoleFromUser = async (username: string) => {
    if (roleToRemove) {
      const response = await removeRoleFromUser(username, roleToRemove);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('feedback:error.remove_role'), NotificationVariant.Error));
        } else {
          dispatch(setNotification(t('feedback:success.removed_role')));
          refetchUsers && refetchUsers();
        }
      }
    }
  };

  return (
    <>
      {userList.length > 0 ? (
        <>
          <StyledTable size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Label>{t('users.username')}</Label>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <StyledTableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell align="right">
                    {roleToRemove && (
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => handleRemoveRoleFromUser(user.username)}
                        startIcon={<DeleteIcon />}>
                        {t('common:remove')}
                      </Button>
                    )}
                    {roleToAdd && (
                      <Button
                        size="small"
                        disabled={user.roles.some((role) => role.rolename === roleToAdd)}
                        onClick={() => handleAddRoleToUser(user.username)}
                        color="primary"
                        variant="contained"
                        startIcon={<AddIcon />}>
                        {t('common:add')}
                      </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
          {(alwaysShowPagination || userList.length > rowsPerPageOptions[0]) && (
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(_, newPage) => setPage(newPage)}
              onChangeRowsPerPage={(event) => {
                setRowsPerPage(parseInt(event.target.value));
                setPage(0);
              }}
            />
          )}
        </>
      ) : (
        <NormalText>
          <i>{t('users.no_users_found')}</i>
        </NormalText>
      )}
    </>
  );
};

export default UserList;
