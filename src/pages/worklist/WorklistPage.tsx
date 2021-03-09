import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LinkIcon from '@material-ui/icons/Link';
import { PageHeader } from '../../components/PageHeader';
import { StyledCenterAlignedContentWrapper, StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import TabButton from '../../components/TabButton';
import DoiRequests from './DoiRequests';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledTabsContainer = styled(StyledCenterAlignedContentWrapper)`
  margin-bottom: 1rem;
`;

const StyledLinkIcon = styled(LinkIcon)`
  width: 3rem;
  height: 3rem;
`;

enum Tab {
  Doi,
  Approval,
}

const WorklistPage: FC = () => {
  const { t } = useTranslation('workLists');
  const [selectedTab, setSelectedTab] = useState(Tab.Doi);

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('my_worklist')}</PageHeader>
      <StyledContainer>
        <StyledTabsContainer>
          <TabButton
            data-testid="doi-requests-button"
            onClick={() => setSelectedTab(Tab.Doi)}
            isSelected={selectedTab === Tab.Doi}>
            <StyledLinkIcon fontSize="large" />
            {t('doi_requests.doi_requests')}
          </TabButton>
        </StyledTabsContainer>

        {selectedTab === Tab.Doi && <DoiRequests />}
      </StyledContainer>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
