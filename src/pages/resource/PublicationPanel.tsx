import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import LoadPublicationPanel from './LoadPublicationPanel';
import LinkPublicationPanel from './LinkPublicationPanel';
import OrcidPublicationPanel from './OrcidPublicationPanel';

const StyledPublicationPanel = styled.div`
  width: 100%;
  padding-top: 2rem;

  > header {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.5rem;
    margin-bottom: 2rem;
  }

  > section {
    display: flex;
    justify-content: space-between;
  }
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

const PublicationPanel: React.FC = () => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <StyledPublicationPanel>
      <header>{t('Choose publication')}</header>
      <section>
        <StyledSelectorWrapper>
          <LoadPublicationPanel expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} />
          <LinkPublicationPanel expanded={expanded === 'link-panel'} onChange={handleChange('link-panel')} />
          <OrcidPublicationPanel expanded={expanded === 'orcid-panel'} onChange={handleChange('orcid-panel')} />
        </StyledSelectorWrapper>
        <StyledInfoBox>
          <header>Information</header>
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
      </section>
    </StyledPublicationPanel>
  );
};

export default PublicationPanel;
