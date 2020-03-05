import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@material-ui/core';
import Label from './../../components/Label';
import { useTranslation } from 'react-i18next';
import { UserAdmin, RoleName } from '../../types/user.types';

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
  }
`;

const StyledButtonTableCell = styled(TableCell)`
  width: 10rem;
`;

const StyledTableCell = styled(TableCell)`
  width: 8rem;
`;

const StyledLargeTableCell = styled(TableCell)`
  width: 10rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
  min-width: 5rem;
`;

interface UserListProps {
  userList: UserAdmin[];
  role: RoleName;
  buttonText: string;
}

const UserList: FC<UserListProps> = ({ userList, role, buttonText }) => {
  const { t } = useTranslation('admin');
  const [addUser, setAddUser] = useState(false);

  const handleAddUser = () => {
    setAddUser(true);
  };

  const handleCancelAdd = () => {
    setAddUser(false);
  };

  const handleSubmitUser = () => {
    // add user with role, how?
  };

  return (
    <>
      {userList?.length > 0 && (
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledLargeTableCell>
                <Label>{t('users.authentication_id')}</Label>
              </StyledLargeTableCell>
              <StyledLargeTableCell>
                <Label>{t('common:name')}</Label>
              </StyledLargeTableCell>
              <StyledLargeTableCell>
                <Label>{t('common:orcid')}</Label>
              </StyledLargeTableCell>
              <StyledTableCell>
                <Label>{t('users.last_login_date')}</Label>
              </StyledTableCell>
              <StyledTableCell>
                <Label>{t('users.created_date')}</Label>
              </StyledTableCell>
              <StyledButtonTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(user => (
              <StyledTableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.externalOrcid}</TableCell>
                <TableCell>{user.lastLoginDate}</TableCell>
                <TableCell>{user.createdDate}</TableCell>
                <TableCell align="right">
                  <StyledButton color="secondary" variant="contained">
                    {t('common:delete')}
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            ))}
            {addUser && (
              <StyledTableRow>
                <TableCell>
                  <TextField label={t('users.authentication_id')} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField label={t('common:name')} variant="outlined" size="small" />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">
                  <StyledButton color="primary" variant="contained">
                    {t('common:add')}
                  </StyledButton>
                  <StyledButton color="secondary" variant="contained" onClick={handleCancelAdd}>
                    {t('common:cancel')}
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      )}
      <StyledButton color="primary" variant="outlined" onClick={handleAddUser} disabled={addUser}>
        {buttonText}
      </StyledButton>
    </>
  );
};

export default UserList;
