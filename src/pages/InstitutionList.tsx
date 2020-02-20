import React, { FC } from 'react';

import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Label from '../components/Label';
import NormalText from '../components/NormalText';
import { MemberInstitutions } from './AdministrateMemberInstitutionsPage';
import { Link as RouterLink } from 'react-router-dom';

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableCellForContact = styled(TableCell)`
  width: 15%;
`;
const StyledTableCellForDate = styled(TableCell)`
  width: 15%;
`;

interface InstitutionListProps {
  institutions: MemberInstitutions[];
}

const InstitutionList: FC<InstitutionListProps> = ({ institutions }) => {
  const { t } = useTranslation();
  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell>
            <Label>{t('common:name')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('common:date')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('common:contact_person')}</Label>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {institutions.map(institution => (
          <StyledTableRow key={institution.id}>
            <TableCell component="th" scope="row">
              <NormalText>{institution.name}</NormalText>
            </TableCell>
            <StyledTableCellForDate>
              <NormalText>{institution.createdDate}</NormalText>
            </StyledTableCellForDate>
            <StyledTableCellForContact>
              <NormalText>{institution.contact}</NormalText>
            </StyledTableCellForContact>
            <TableCell>
              <Button color="primary" component={RouterLink} to="/">
                <NormalText>{t('common:edit')}</NormalText>
              </Button>
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default InstitutionList;
