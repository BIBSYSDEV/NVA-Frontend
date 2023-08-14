import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ListPagination } from '../../../components/ListPagination';
import { setNotification } from '../../../redux/notificationSlice';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS, isErrorStatus, isSuccessStatus } from '../../../utils/constants';

interface UserListProps {
  userList: InstitutionUser[];
  tableCaption: string;
  roleToRemove?: RoleName;
  roleToAdd?: RoleName;
  refetchUsers?: () => void;
  showScope?: boolean;
}

export const UserList = ({ userList, tableCaption, roleToRemove, roleToAdd, refetchUsers }: UserListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);
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
        dispatch(setNotification({ message: t('feedback.error.add_role'), variant: 'error' }));
      } else if (isSuccessStatus(updateUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.added_role'), variant: 'success' }));
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
        dispatch(setNotification({ message: t('feedback.error.remove_role'), variant: 'error' }));
      } else if (isSuccessStatus(updateUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.removed_role'), variant: 'success' }));
        refetchUsers?.();
      }
    }
    setRemoveRoleForUser('');
  };

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = userList.length <= (page - 1) * rowsPerPage ? 1 : page;
  const isLastInstitutionAdmin = roleToRemove === RoleName.InstitutionAdmin && userList.length === 1;

  const sortedList = userList.sort((a, b) =>
    `${a.givenName} ${a.familyName}`.toLocaleLowerCase() < `${b.givenName} ${b.familyName}`.toLocaleLowerCase() ? -1 : 1
  );
  const adminsOnPage = sortedList.slice((validPage - 1) * rowsPerPage, validPage * rowsPerPage);

  return (
    <>
      {sortedList.length === 0 ? (
        <Typography>
          <i>{t('editor.curators.no_users_found')}</i>
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: '0.5rem' }}>
            <Table size="small" sx={alternatingTableRowColor}>
              <caption style={visuallyHidden}>{tableCaption}</caption>
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.username')}</TableCell>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell width="150">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminsOnPage.map((user) => {
                  const isLoading = updatedRoleForUsers.includes(user.username);
                  const disableAddButton = user.roles.some((role) => role.rolename === roleToAdd);
                  return (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {user.givenName} {user.familyName}
                      </TableCell>
                      <TableCell>
                        {roleToRemove && (
                          <Button
                            color="error"
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            disabled={isLastInstitutionAdmin}
                            data-testid={`button-remove-role-${roleToRemove}-${user.username}`}
                            onClick={() => setRemoveRoleForUser(user.username)}>
                            {t('common.remove')}
                          </Button>
                        )}
                        {roleToAdd && (
                          <LoadingButton
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            loadingPosition="start"
                            disabled={disableAddButton}
                            loading={!disableAddButton && isLoading}
                            data-testid={`button-add-role-${roleToAdd}-${user.username}`}
                            onClick={() => handleAddRoleToUser(user)}>
                            {t('common.add')}
                          </LoadingButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <ListPagination
            count={sortedList.length}
            rowsPerPage={rowsPerPage}
            page={validPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(1);
            }}
          />

          {roleToRemove && (
            <ConfirmDialog
              open={!!removeRoleForUser}
              title={t('basic_data.institutions.remove_role_title')}
              isLoading={updatedRoleForUsers.length > 0}
              onCancel={() => setRemoveRoleForUser('')}
              onAccept={handleRemoveRoleFromUser}
              dialogDataTestId="confirm-remove-role-dialog">
              {t('basic_data.institutions.remove_role_text')}
            </ConfirmDialog>
          )}
        </>
      )}
    </>
  );
};
