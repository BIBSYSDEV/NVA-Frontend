import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TablePagination } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Label from './../../components/Label';
import { InstitutionUser, RoleName } from '../../types/user.types';
import NormalText from '../../components/NormalText';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';

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
  alwaysShowPagination?: boolean; // If false, show pagination only if more elements than minimum rows per page
}

const UserList: FC<UserListProps> = ({ userList, roleToRemove, roleToAdd, alwaysShowPagination = false }) => {
  const { t } = useTranslation('admin');
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Move to first page if userList change due to e.g. filtering
    setPage(0);
  }, [userList]);

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
                      <Button color="secondary" variant="contained">
                        {t('common:delete')}
                      </Button>
                    )}
                    {roleToAdd && (
                      <Button
                        size="small"
                        disabled={user.roles.some((role) => role.rolename === roleToAdd)}
                        color="primary"
                        variant="contained">
                        {t('common:add')}
                      </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
          {(alwaysShowPagination || userList.length > ROWS_PER_PAGE_OPTIONS[0]) && (
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
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
