import React, { FC } from 'react';

import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Label from '../components/Label';
import NormalText from '../components/NormalText';
import { DummyCustomerInstitution } from './AdminCustomerInstitutionsPage';
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
  institutions: DummyCustomerInstitution[];
}

const InstitutionList: FC<InstitutionListProps> = ({ institutions }) => {
  const { t } = useTranslation('common');

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell>
            <Label>{t('name')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('date')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('contact_person')}</Label>
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
                <NormalText>{t('edit')}</NormalText>
              </Button>
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default InstitutionList;
