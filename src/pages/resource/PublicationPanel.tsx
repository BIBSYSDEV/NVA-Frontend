import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Link as MuiLink } from '@material-ui/core';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import LinkPublicationPanel from './LinkPublicationPanel';
import LoadPublicationPanel from './LoadPublicationPanel';
import OrcidPublicationPanel from './OrcidPublicationPanel';
import { useTranslation } from 'react-i18next';

const StyledPublicationPanel = styled.div`
  width: 100%;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const StyledSelectorWrapper = styled.div`
  flex-basis: 60%;
  min-width: 10rem;
`;

const StyledInfoBox = styled.div`
  flex-basis: 30%;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;

  > header {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5rem;
    margin-bottom: 2rem;
  }

  > section {
    margin-bottom: 2rem;
  }
`;

interface PublicationPanelProps {
  goToNextTab: () => void;
  tabNumber: number;
}

const PublicationPanel: React.FC<PublicationPanelProps> = ({ goToNextTab, tabNumber }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const errors = useSelector((store: RootStore) => store.errors);
  const { t } = useTranslation();

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <TabPanel
      isHidden={tabNumber !== 0}
      ariaLabel="publication"
      goToNextTab={goToNextTab}
      errors={errors.publicationErrors}
      heading="Publication">
      <StyledPublicationPanel>
        <StyledSelectorWrapper>
          <LoadPublicationPanel expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} />
          <LinkPublicationPanel
            expanded={expanded === 'link-panel'}
            goToNextTab={goToNextTab}
            onChange={handleChange('link-panel')}
          />
          <OrcidPublicationPanel expanded={expanded === 'orcid-panel'} onChange={handleChange('orcid-panel')} />
        </StyledSelectorWrapper>
        <StyledInfoBox>
          <header>{t('Information')}</header>
          <section>
            Velg publikasjoner Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </section>
          <MuiLink component={Link} to={'/'} underline={'none'}>
            Hvilken type publikasjoner kan jeg laste opp
          </MuiLink>
        </StyledInfoBox>
      </StyledPublicationPanel>
    </TabPanel>
  );
};

export default PublicationPanel;
