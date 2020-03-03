import React, { FC } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import Label from './../../components/Label';
import { useTranslation } from 'react-i18next';
import { UserAdmin } from '../../types/user.types';

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
  }
`;

interface UserListProps {
  userList: UserAdmin[];
}

const UserList: FC<UserListProps> = ({ userList }) => {
  const { t } = useTranslation('profile');

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell>
            <Label>{t('users.authentication_id')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('common:name')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('common:orcid')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('users.last_login_date')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('users.created_date')}</Label>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {userList.map(user => {
          return (
            <StyledTableRow>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.externalOrcid}</TableCell>
              <TableCell>{user.lastLoginDate}</TableCell>
              <TableCell>{user.createdDate}</TableCell>
              <TableCell>
                <Button color="secondary" variant="contained">
                  {t('common:delete')}
                </Button>
              </TableCell>
            </StyledTableRow>
          );
        })}
      </TableBody>
    </StyledTable>
  );
};

export default UserList;
