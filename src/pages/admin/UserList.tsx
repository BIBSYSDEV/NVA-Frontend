import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { LoadingButton } from '@mui/lab';
import { updateUser } from '../../api/roleApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { isErrorStatus, isSuccessStatus, ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;

interface UserListProps {
  userList: InstitutionUser[];
  tableCaption: string;
  roleToRemove?: RoleName;
  roleToAdd?: RoleName;
  refetchUsers?: () => void;
  alwaysShowPagination?: boolean; // If false, show pagination only if more elements than minimum rows per page
}

export const UserList = ({
  userList,
  tableCaption,
  roleToRemove,
  roleToAdd,
  refetchUsers,
  alwaysShowPagination = false,
}: UserListProps) => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(0);
  const [updatedRoleForUsers, setUpdatedRoleForUsers] = useState<string[]>([]);
  const [removeRoleForUser, setRemoveRoleForUser] = useState('');

  const handleAddRoleToUser = async (user: InstitutionUser) => {
    if (roleToAdd) {
      setUpdatedRoleForUsers((state) => [...state, user.username]);
      const newUser: InstitutionUser = {
        ...user,
        roles: [...user.roles, { type: 'Role', rolename: roleToAdd }],
      };
      const updateUserResponse = await updateUser(user.username, newUser);
      if (isErrorStatus(updateUserResponse.status)) {
        setUpdatedRoleForUsers((state) => state.filter((username) => username !== user.username));
        dispatch(setNotification(t('feedback:error.add_role'), NotificationVariant.Error));
      } else if (isSuccessStatus(updateUserResponse.status)) {
        dispatch(setNotification(t('feedback:success.added_role')));
        refetchUsers?.();
      }
    }
  };

  const handleRemoveRoleFromUser = async () => {
    if (roleToRemove && removeRoleForUser) {
      setUpdatedRoleForUsers((state) => [...state, removeRoleForUser]);

      const existingUser = userList.find((user) => user.username === removeRoleForUser);
      if (!existingUser) {
        return;
      }
      const newUser: InstitutionUser = {
        ...existingUser,
        roles: existingUser.roles.filter((role) => role.rolename !== roleToRemove),
      };
      const updateUserResponse = await updateUser(removeRoleForUser, newUser);
      if (isErrorStatus(updateUserResponse.status)) {
        setUpdatedRoleForUsers((state) => state.filter((user) => user !== removeRoleForUser));
        dispatch(setNotification(t('feedback:error.remove_role'), NotificationVariant.Error));
      } else if (isSuccessStatus(updateUserResponse.status)) {
        dispatch(setNotification(t('feedback:success.removed_role')));
        refetchUsers?.();
      }
    }
    setRemoveRoleForUser('');
  };

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = userList.length <= page * rowsPerPage ? 0 : page;
  const isLastInstitutionAdmin = roleToRemove === RoleName.INSTITUTION_ADMIN && userList.length === 1;

  return (
    <>
      {userList.length === 0 ? (
        <Typography>
          <i>{t('users.no_users_found')}</i>
        </Typography>
      ) : (
        <>
          <StyledTable size="small">
            <caption>
              <span style={visuallyHidden}>{tableCaption}</span>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <StyledTypography>{t('users.username')}</StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography>{t('common:name')}</StyledTypography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((user, index) => {
                const isLoading = updatedRoleForUsers.includes(user.username);
                const disableAddButton = user.roles.some((role) => role.rolename === roleToAdd);
                return (
                  <StyledTableRow key={index}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.givenName} {user.familyName}
                    </TableCell>
                    <TableCell align="right">
                      {roleToRemove && (
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          disabled={isLastInstitutionAdmin}
                          data-testid={`button-remove-role-${roleToRemove}-${user.username}`}
                          onClick={() => setRemoveRoleForUser(user.username)}>
                          {t('common:remove')}
                        </Button>
                      )}
                      {roleToAdd && (
                        <LoadingButton
                          color="primary"
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          loadingPosition="start"
                          disabled={disableAddButton}
                          loading={!disableAddButton && isLoading}
                          data-testid={`button-add-role-${roleToAdd}-${user.username}`}
                          onClick={() => handleAddRoleToUser(user)}>
                          {t('common:add')}
                        </LoadingButton>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </StyledTable>
          {(alwaysShowPagination || userList.length > ROWS_PER_PAGE_OPTIONS[0]) && (
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={validPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value));
                setPage(0);
              }}
              data-testid={`user-pagination-${roleToRemove ?? roleToAdd}`}
            />
          )}
          {roleToRemove && (
            <ConfirmDialog
              open={!!removeRoleForUser}
              title={t('users.remove_role_title')}
              isLoading={updatedRoleForUsers.length > 0}
              onCancel={() => setRemoveRoleForUser('')}
              onAccept={handleRemoveRoleFromUser}
              dataTestId="confirm-remove-role-dialog">
              {t('users.remove_role_text')}
            </ConfirmDialog>
          )}
        </>
      )}
    </>
  );
};
