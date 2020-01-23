import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Link as MuiLink } from '@material-ui/core';

import LinkPublication from './new_publication/LinkPublication';
import LoadPublication from './new_publication/LoadPublication';
import PublicationForm from './PublicationForm';

const StyledNewPublication = styled.div`
  width: 100%;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display:block;
    margin-right: 0;
    flex-wrap: wrap;
  }
} 
`;

const StyledSelectorWrapper = styled.div`
  flex: 1;
  max-width: 50rem;
  margin-right: 2rem;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-right: 0;
  }
}
`;

const StyledInfoBox = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;
  max-width: 25rem;
  flex: 1;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: inherit;
    margin-right: 0;
  }
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

const StyledButton = styled(Button)`
  margin: 1rem;
`;

const NewPublication: FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      {!showForm ? (
        <>
          <StyledNewPublication>
            <StyledSelectorWrapper>
              <LoadPublication expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} />
              <LinkPublication
                expanded={expanded === 'link-panel'}
                onChange={handleChange('link-panel')}
                openForm={handleClick}
              />
            </StyledSelectorWrapper>
            <StyledInfoBox>
              <header>{t('common:information')}</header>
              <section>
                Velg publikasjoner Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum.
              </section>
              <MuiLink component={Link} to={'/'} underline={'none'}>
                Hvilke type publikasjoner kan jeg laste opp
              </MuiLink>
            </StyledInfoBox>
          </StyledNewPublication>
          {/* temporary button so that we can navigate to schema */}
          <StyledButton color="primary" variant="contained" data-testid="new-schema-button" onClick={handleClick}>
            {t('new_publication')}
          </StyledButton>
        </>
      ) : (
        <PublicationForm />
      )}
    </>
  );
};

export default NewPublication;
