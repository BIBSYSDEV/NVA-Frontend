import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Link as MuiLink } from '@material-ui/core';

import LinkPublication from './new_publication/LinkPublication';
import LoadPublication from './new_publication/LoadPublication';
import PublicationForm from './PublicationForm';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { createUppy } from '../../utils/uppy-config';
import NormalText from '../../components/NormalText';

const shouldAllowMultipleFiles = true;

const StyledEditPublication = styled.div`
  width: 100%;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: block;
    margin-right: 0;
    flex-wrap: wrap;
  }
`;

const StyledSelectorWrapper = styled.div`
  flex: 1;
  max-width: 50rem;
  margin-right: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-right: 0;
  }
`;

const StyledCard = styled(Card)`
  padding: 1rem;
  max-width: 25rem;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: inherit;
    margin-right: 0;
  }
  > section {
    margin-bottom: 2rem;
  }
`;

const StyledButton = styled(Button)`
  margin: 1rem;
`;

const EditPublication: FC = () => {
  const { id } = useParams();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showForm, setShowForm] = useState(!!id);
  const { t } = useTranslation();
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));

  useEffect(() => {
    return () => uppy && uppy.close();
  }, [uppy]);

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
          <StyledEditPublication>
            <StyledSelectorWrapper>
              <LoadPublication
                expanded={expanded === 'load-panel'}
                onChange={handleChange('load-panel')}
                uppy={uppy}
                openForm={() => setShowForm(true)}
              />
              <LinkPublication
                expanded={expanded === 'link-panel'}
                onChange={handleChange('link-panel')}
                openForm={handleClick}
              />
            </StyledSelectorWrapper>
            <StyledCard>
              <Heading>{t('common:information')}</Heading>
              <NormalText>
                Velg publikasjoner Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum.
              </NormalText>
              <MuiLink component={Link} to={'/'} underline={'none'}>
                Hvilke type publikasjoner kan jeg laste opp
              </MuiLink>
            </StyledCard>
          </StyledEditPublication>
          {/* temporary button so that we can navigate to schema */}
          <StyledButton color="primary" variant="contained" data-testid="new-schema-button" onClick={handleClick}>
            {t('new_publication')}
          </StyledButton>
        </>
      ) : (
        <PublicationForm uppy={uppy} id={id} />
      )}
    </>
  );
};

export default EditPublication;
