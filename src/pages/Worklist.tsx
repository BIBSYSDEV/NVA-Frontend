import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import styled from 'styled-components';
import { TableHead, TableRow, TableCell, TableBody, Button, Table } from '@material-ui/core';
import Label from '../components/Label';
import NormalText from '../components/NormalText';
import { PublicationPreview } from '../types/publication.types';
import { getDoiRequests } from '../api/publicationApi';
import Card from '../components/Card';

const StyledTabsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledTabButton = styled.button<{ isSelected: boolean }>`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 15rem;
  font-weight: bold;
  font-size: 1.2rem;

  ${({ isSelected, theme }) =>
    isSelected &&
    `
      color: ${theme.palette.primary.main};
      border-bottom: 0.3rem solid;
    `};
`;

const StyledContent = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const StyledPlaylistAddCheckIcon = styled(PlaylistAddCheckIcon)`
  width: 3rem;
  height: 3rem;
`;

const StyledLinkIcon = styled(LinkIcon)`
  width: 3rem;
  height: 3rem;
`;

enum Tab {
  Doi,
  Approval,
}

const Worklist: FC = () => {
  const { t } = useTranslation('workLists');
  const [selectedTab, setSelectedTab] = useState(Tab.Doi);

  return (
    <>
      <StyledTabsContainer>
        <StyledTabButton onClick={() => setSelectedTab(Tab.Approval)} isSelected={selectedTab === Tab.Approval}>
          <StyledPlaylistAddCheckIcon fontSize="large" />
          {t('for_approval')}
        </StyledTabButton>
        <StyledTabButton onClick={() => setSelectedTab(Tab.Doi)} isSelected={selectedTab === Tab.Doi}>
          <StyledLinkIcon fontSize="large" />
          {t('doi_requests')}
        </StyledTabButton>
      </StyledTabsContainer>

      <StyledContent>
        {selectedTab === Tab.Approval && <div>For Approval</div>}
        {selectedTab === Tab.Doi && <DoiRequestsWorklist />}
      </StyledContent>
    </>
  );
};

export default Worklist;

const DoiRequestsWorklist: FC = () => {
  const [doiRequests, setDoiRequests] = useState([]);

  useEffect(() => {
    // Get Doi requests
    const fetchDoiRequests = async () => {
      const doiRequestsResponse = await getDoiRequests();
      if (!doiRequestsResponse.error) {
        setDoiRequests(doiRequestsResponse);
      }
    };
    fetchDoiRequests();
  }, []);

  return (
    <Card>
      <WorklistTable publications={doiRequests} />
    </Card>
  );
};

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
