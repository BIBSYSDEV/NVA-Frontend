import React, { FC } from 'react';

import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PublishedPublicationPreview, PublicationStatus } from '../../types/publication.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';

const StyledCard = styled(Card)`
  width: 100%;
`;

const StyledHeading = styled(Heading)`
  text-align: left;
`;

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${props => props.theme.palette.background.default};
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

const StyledAuthor = styled.div`
  font-style: italic;
  font-size: 0.8rem;
  padding-top: 0.2rem;
`;

interface PublicationListProps {
  publications: PublishedPublicationPreview[];
}

const PublishedPublicationList: FC<PublicationListProps> = ({ publications }) => {
  const { t } = useTranslation();
  return (
    <StyledCard>
      <StyledHeading>{`${t('common:publications')} (${
        publications.filter(publication => publication.status === PublicationStatus.PUBLISHED).length
      })`}</StyledHeading>
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
          {publications
            .filter(publication => publication.status === PublicationStatus.PUBLISHED)
            .map(publication => (
              <StyledTableRow key={publication.id}>
                <TableCell component="th" scope="row">
                  <NormalText>{publication.title}</NormalText>
                  <StyledAuthor>
                    <NormalText>
                      {publication.authors[0].name}, {publication.authors[0].institutions[0].name}
                    </NormalText>
                  </StyledAuthor>
                </TableCell>
                <StyledTableCellForPublisher>
                  <NormalText>
                    {Object.values(publication.reference).find(value => value.publisher).publisher}
                  </NormalText>
                </StyledTableCellForPublisher>
                <StyledTableCellForType>
                  <NormalText>{t('referenceTypes:' + publication.reference.type)}</NormalText>
                </StyledTableCellForType>
                <StyledTableCellForDate>
                  <NormalText>{publication.publicationDate?.year}</NormalText>
                </StyledTableCellForDate>
                <TableCell>
                  <Button color="primary" variant="outlined" data-testid="read-button">
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
