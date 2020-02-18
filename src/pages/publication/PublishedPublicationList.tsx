import React, { FC } from 'react';

import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PublishedPublicationPreview, PublicationStatus } from '../../types/publication.types';
import FormCardSubHeading from '../../components/FormCard/FormCardSubHeading';
import FormCard from '../../components/FormCard/FormCard';

const StyledHeading = styled(FormCardSubHeading)`
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
    <FormCard>
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
          {publications
            .filter(publication => publication.status === PublicationStatus.PUBLISHED)
            .map(publication => (
              <StyledTableRow key={publication.id}>
                <TableCell component="th" scope="row">
                  <div>{publication.title}</div>
                  <StyledAuthor>
                    {publication.authors[0].name}, {publication.authors[0].institutions[0].name}
                  </StyledAuthor>
                </TableCell>
                <StyledTableCellForPublisher>
                  {Object.values(publication.reference).find(value => value.publisher).publisher}
                </StyledTableCellForPublisher>
                <StyledTableCellForType>{t('referenceTypes:' + publication.reference.type)}</StyledTableCellForType>
                <StyledTableCellForDate>{publication.publicationDate?.year}</StyledTableCellForDate>
                <TableCell>
                  <Button color="primary" variant="outlined" data-testid="edit-button">
                    {t('common:read')}
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </StyledTable>
    </FormCard>
  );
};

export default PublishedPublicationList;
