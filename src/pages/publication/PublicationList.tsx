import React, { FC } from 'react';

import styled from 'styled-components';
import { DummyPublicationListElement } from './MyPublications';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface StyledTableRowProps {
  index: number;
}
const StyledTableRow = styled(TableRow)<StyledTableRowProps>`
  background-color: ${props =>
    Boolean(props.index % 2) ? props.theme.palette.box.main : props.theme.palette.background.default};
`;
const StyledTable = styled(Table)`
  width: 100%;
`;

interface PublicationListProps {
  elements: DummyPublicationListElement[];
}

const PublicationList: FC<PublicationListProps> = ({ elements }) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">{t('workLists:publication_name')}</TableCell>
            <TableCell align="left">{t('common:status')}</TableCell>
            <TableCell align="left">{t('common:date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elements.map((element, index) => (
            <StyledTableRow key={index} index={index}>
              <TableCell component="th" scope="row">
                {element.title}
              </TableCell>
              <TableCell align="left">{element.status}</TableCell>
              <TableCell align="left">{element.date}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};

export default PublicationList;
