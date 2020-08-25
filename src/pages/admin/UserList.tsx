import React, { FC } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Label from './../../components/Label';
import { InstitutionUser } from '../../types/user.types';
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
}

const UserList: FC<UserListProps> = ({ userList }) => {
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
              <TableCell>
                <Label>{t('common:institution')}</Label>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user) => (
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
