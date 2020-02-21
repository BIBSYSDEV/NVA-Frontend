import React, { FC } from 'react';
import styled from 'styled-components';
import { TableRow, Table, TableHead, TableCell, TableBody, Button } from '@material-ui/core';
import { PublicationPreview } from '../../types/publication.types';
import { useTranslation } from 'react-i18next';
import Label from '../../components/Label';
import NormalText from '../../components/NormalText';

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
  }
`;

interface WorklistTableProps {
  publications: PublicationPreview[];
}

const WorklistTable: FC<WorklistTableProps> = ({ publications }) => {
  const { t } = useTranslation();

  console.log(publications);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Label>{t('workLists:publication_name')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('workLists:submitter')}</Label>
          </TableCell>
          <TableCell>
            <Label>{t('common:date')}</Label>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {publications.map(publication => (
          <StyledTableRow key={publication.id}>
            <TableCell component="th" scope="row">
              <NormalText>{publication.title}</NormalText>
            </TableCell>
            <TableCell>
              <NormalText>{publication.createdBy}</NormalText>
            </TableCell>
            <TableCell>
              <NormalText>{publication.createdDate}</NormalText>
            </TableCell>
            <TableCell>
              <Button color="primary" variant="contained">
                <NormalText>{t('common:open')}</NormalText>
              </Button>
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WorklistTable;
