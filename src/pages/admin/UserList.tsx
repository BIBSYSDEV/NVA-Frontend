import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@material-ui/core';
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
import ButtonWithProgress from '../../components/ButtonWithProgress';
import ConfirmDialog from '../../components/ConfirmDialog';

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
  const [updatedRoleForUsers, setUpdatedRoleForUsers] = useState<string[]>([]);
  const [removeRoleForUser, setRemoveRoleForUser] = useState('');

  const handleAddRoleToUser = async (username: string) => {
    if (roleToAdd) {
      setUpdatedRoleForUsers((state) => [...state, username]);
      const response = await addRoleToUser(username, roleToAdd);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('feedback:error.add_role'), NotificationVariant.Error));
        } else {
          dispatch(setNotification(t('feedback:success.added_role')));
          refetchUsers?.();
        }
      }
    }
  };

  const handleRemoveRoleFromUser = async () => {
    if (roleToRemove && removeRoleForUser) {
      setUpdatedRoleForUsers((state) => [...state, removeRoleForUser]);
      const response = await removeRoleFromUser(removeRoleForUser, roleToRemove);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('feedback:error.remove_role'), NotificationVariant.Error));
        } else {
          dispatch(setNotification(t('feedback:success.removed_role')));
          refetchUsers?.();
        }
      }
    }
    setRemoveRoleForUser('');
  };

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = userList.length <= page * rowsPerPage ? 0 : page;

  return (
    <>
      {userList.length === 0 ? (
        <NormalText>
          <i>{t('users.no_users_found')}</i>
        </NormalText>
      ) : (
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
              {userList.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((user) => {
                const isLoading = updatedRoleForUsers.includes(user.username);
                const disableAddButton = user.roles.some((role) => role.rolename === roleToAdd);
                return (
                  <StyledTableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell align="right">
                      {roleToRemove && (
                        <ButtonWithProgress
                          color="secondary"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          isLoading={isLoading}
                          onClick={() => setRemoveRoleForUser(user.username)}>
                          {t('common:remove')}
                        </ButtonWithProgress>
                      )}
                      {roleToAdd && (
                        <ButtonWithProgress
                          color="primary"
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          disabled={disableAddButton}
                          isLoading={!disableAddButton && isLoading}
                          onClick={() => handleAddRoleToUser(user.username)}>
                          {t('common:add')}
                        </ButtonWithProgress>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </StyledTable>
          {(alwaysShowPagination || userList.length > rowsPerPageOptions[0]) && (
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={validPage}
              onChangePage={(_, newPage) => setPage(newPage)}
              onChangeRowsPerPage={(event) => {
                setRowsPerPage(parseInt(event.target.value));
                setPage(0);
              }}
            />
          )}
          {roleToRemove && (
            <ConfirmDialog
              open={!!removeRoleForUser}
              title={t('users.remove_role_title')}
              onCancel={() => setRemoveRoleForUser('')}
              onAccept={handleRemoveRoleFromUser}>
              {t('users.remove_role_text')}
            </ConfirmDialog>
          )}
        </>
      )}
    </>
  );
};

export default UserList;
