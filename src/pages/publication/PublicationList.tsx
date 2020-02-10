import React, { FC } from 'react';

import styled from 'styled-components';
import { DummyPublicationListElement } from './MyPublications';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableCellForStatus = styled(TableCell)`
  width: 15%;
`;
const StyledTableCellForDate = styled(TableCell)`
  width: 15%;
`;

interface PublicationListProps {
  elements: DummyPublicationListElement[];
}

const PublicationList: FC<PublicationListProps> = ({ elements }) => {
  const { t } = useTranslation();
  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell>{t('workLists:publication_name')}</TableCell>
          <TableCell>{t('common:status')}</TableCell>
          <TableCell>{t('common:date')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {elements.map((element, index) => (
          <StyledTableRow key={index}>
            <TableCell component="th" scope="row">
              {element.title}
            </TableCell>
            <StyledTableCellForStatus>{element.status}</StyledTableCellForStatus>
            <StyledTableCellForDate>{element.createdDate}</StyledTableCellForDate>
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default PublicationList;
