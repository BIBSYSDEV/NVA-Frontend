import React, { FC } from 'react';

import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PublishedPublicationPreview } from '../../types/publication.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { useHistory } from 'react-router';

const StyledCard = styled(Card)`
  width: 100%;
`;

const StyledHeading = styled(Heading)`
  text-align: left;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableCellForPublisher = styled(TableCell)`
  width: 15%;
`;

const StyledTableCellForDate = styled(TableCell)`
  width: 10%;
`;

const StyledTableCellForType = styled(TableCell)`
  width: 15%;
`;

interface PublicationListProps {
  publications: PublishedPublicationPreview[];
}

const PublishedPublicationList: FC<PublicationListProps> = ({ publications }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleOpenPublication = (id: string) => {
    history.push(`/publication/${id}/public`);
  };

  return (
    <StyledCard>
      <StyledHeading>{`${t('common:publications')} (${publications.length})`}</StyledHeading>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>{t('common:title')}</TableCell>
            <TableCell>{t('common:publisher')}</TableCell>
            <TableCell>{t('common:type')}</TableCell>
            <TableCell>{t('common:year')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {publications.map((publication) => (
            <StyledTableRow key={publication.identifier}>
              <TableCell component="th" scope="row">
                <NormalText>{publication.mainTitle}</NormalText>
              </TableCell>
              <StyledTableCellForPublisher>
                <NormalText>{publication.reference?.publicationContext?.title}</NormalText>
              </StyledTableCellForPublisher>
              <StyledTableCellForType>
                {publication.publicationType && (
                  <NormalText>{t(`publicationTypes:${publication.publicationType}`)}</NormalText>
                )}
              </StyledTableCellForType>
              <StyledTableCellForDate>
                <NormalText>{new Date(publication.createdDate).getFullYear()}</NormalText>
              </StyledTableCellForDate>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  data-testid="read-button"
                  onClick={() => handleOpenPublication(publication.identifier)}>
                  <NormalText>{t('common:read')}</NormalText>
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledCard>
  );
};

export default PublishedPublicationList;
