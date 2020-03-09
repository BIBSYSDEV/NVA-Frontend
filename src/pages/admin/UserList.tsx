import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@material-ui/core';
import Label from './../../components/Label';
import { useTranslation } from 'react-i18next';
import { UserAdmin, RoleName } from '../../types/user.types';
import { addUserToInstitution } from '../../api/userAdminApi';

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
  min-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledTableCell = styled(TableCell)`
  min-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLargeTableCell = styled(TableCell)`
  min-width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
  min-width: 5rem;
`;

interface UserListProps {
  cristinUnitId: string;
  userList: UserAdmin[];
  role: RoleName;
  buttonText: string;
}

const UserList: FC<UserListProps> = ({ userList, role, buttonText, cristinUnitId }) => {
  const { t } = useTranslation('admin');
  const [addUser, setAddUser] = useState(false);

  const toggleAddUser = () => {
    setAddUser(!addUser);
  };

  const handleSubmitUser = () => {
    // add user with role, how?
    const authenticationId = '';
    addUserToInstitution(cristinUnitId, authenticationId, role);
  };

  const handleChangeAuthenticationId = () => {};

  const handleChangeName = () => {};

  return (
    <>
      {(userList?.length > 0 || addUser) && (
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
                <StyledLargeTableCell>{user.id}</StyledLargeTableCell>
                <StyledLargeTableCell>{user.name}</StyledLargeTableCell>
                <StyledLargeTableCell>{user.externalOrcid}</StyledLargeTableCell>
                <StyledTableCell>{user.lastLoginDate}</StyledTableCell>
                <StyledTableCell>{user.createdDate}</StyledTableCell>
                <StyledButtonTableCell align="right">
                  <StyledButton color="secondary" variant="contained">
                    {t('common:delete')}
                  </StyledButton>
                </StyledButtonTableCell>
              </StyledTableRow>
            ))}
            {addUser && (
              <StyledTableRow>
                <TableCell>
                  <TextField
                    label={t('users.authentication_id')}
                    variant="outlined"
                    size="small"
                    onChange={handleChangeAuthenticationId}
                  />
                </TableCell>
                <TableCell>
                  <TextField label={t('common:name')} variant="outlined" size="small" onChange={handleChangeName} />
                </TableCell>
                <TableCell colSpan={4} align="right">
                  <StyledButton color="primary" variant="contained" onClick={handleSubmitUser}>
                    {t('common:add')}
                  </StyledButton>
                  <StyledButton color="secondary" variant="contained" onClick={toggleAddUser}>
                    {t('common:cancel')}
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      )}
      <StyledButton color="primary" variant="outlined" onClick={toggleAddUser} disabled={addUser}>
        {buttonText}
      </StyledButton>
    </>
  );
};

export default UserList;
