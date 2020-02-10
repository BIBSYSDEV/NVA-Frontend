import React, { FC } from 'react';

import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PublicationPreview } from '../../types/publication.types';

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
  publications: PublicationPreview[];
}

const PublicationList: FC<PublicationListProps> = ({ publications }) => {
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
        {publications.map(publication => (
          <StyledTableRow key={publication.id}>
            <TableCell component="th" scope="row">
              {publication.title}
            </TableCell>
            <StyledTableCellForStatus>{t(`publication:status.${publication.status}`)}</StyledTableCellForStatus>
            <StyledTableCellForDate>{publication.createdDate}</StyledTableCellForDate>
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default PublicationList;
