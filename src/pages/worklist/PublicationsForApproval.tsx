import React, { FC, useState, useEffect } from 'react';
import { getPublicationsForApproval } from '../../api/publicationApi';
import Card from '../../components/Card';
import WorklistTable from './WorkListTable';
import { useTranslation } from 'react-i18next';
import Progress from '../../components/Progress';
import SubHeading from '../../components/SubHeading';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  text-align: center;
  min-height: 5rem;
`;

const PublicationsForApproval: FC = () => {
  const { t } = useTranslation('workLists');
  const [publicationsForApproval, setPublicationsForApproval] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicationsForApproval = async () => {
      const publicationsForApprovalResponse = await getPublicationsForApproval();
      if (!publicationsForApprovalResponse.error) {
        setPublicationsForApproval(publicationsForApprovalResponse);
        setIsLoading(false);
      }
    };
    fetchPublicationsForApproval();
  }, []);

  return (
    <StyledCard>
      {isLoading ? (
        <Progress />
      ) : publicationsForApproval.length > 0 ? (
        <WorklistTable publications={publicationsForApproval} />
      ) : (
        <SubHeading>{t('no_pending_publications')}</SubHeading>
      )}
    </StyledCard>
  );
};

export default PublicationsForApproval;
