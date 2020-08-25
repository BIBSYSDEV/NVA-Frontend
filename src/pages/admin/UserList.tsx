import React, { FC } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Label from './../../components/Label';
import { InstitutionUser, RoleName } from '../../types/user.types';
import NormalText from '../../components/NormalText';

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
  allowRemoveRole?: RoleName;
  allowAddRole?: RoleName;
}

const UserList: FC<UserListProps> = ({ userList, allowRemoveRole = false, allowAddRole = false }) => {
  const { t } = useTranslation('admin');

  return (
    <>
      {userList.length > 0 ? (
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>
                <Label>{t('users.username')}</Label>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user) => (
              <StyledTableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell align="right">
                  {allowRemoveRole && (
                    <Button color="secondary" variant="contained">
                      {t('common:delete')}
                    </Button>
                  )}
                  {allowAddRole && (
                    <Button
                      disabled={user.roles.some((role) => role.rolename === allowAddRole)}
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
      ) : (
        <NormalText>
          <i>{t('users.no_users_found')}</i>
        </NormalText>
      )}
    </>
  );
};

export default UserList;
