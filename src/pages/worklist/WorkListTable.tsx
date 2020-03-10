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

const StyledCell = styled(TableCell)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    min-width: 9rem;
  }
`;

interface WorklistTableProps {
  publications: PublicationPreview[];
}

const WorklistTable: FC<WorklistTableProps> = ({ publications }) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledCell>
            <Label>{t('workLists:publication_name')}</Label>
          </StyledCell>
          <StyledCell>
            <Label>{t('workLists:submitter')}</Label>
          </StyledCell>
          <StyledCell>
            <Label>{t('common:date')}</Label>
          </StyledCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {publications.map(publication => (
          <StyledTableRow key={publication.identifier}>
            <StyledCell component="th" scope="row">
              <NormalText>{publication.title}</NormalText>
            </StyledCell>
            <StyledCell>
              <NormalText>{publication.createdBy}</NormalText>
            </StyledCell>
            <StyledCell>
              <NormalText>{publication.createdDate}</NormalText>
            </StyledCell>
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
