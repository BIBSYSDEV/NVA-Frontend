import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkPublication from './new_publication/LinkPublication';
import LoadPublication from './new_publication/LoadPublication';
import PublicationForm from './PublicationForm';
import Card from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { Typography } from '@material-ui/core';

const StyledEditPublication = styled.div`
  display: grid;
  grid-template-areas: 'accordion information' 'accordion .';
  grid-gap: 1rem;
  padding-top: 2rem;
  margin: 0 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'information' 'accordion';
    width: 90%;
  }
`;

const StyledSelectorWrapper = styled.div`
  grid-area: accordion;
  max-width: 50rem;
`;

const StyledCard = styled(Card)`
  grid-area: information;
  padding: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: 90vw;
  }
`;

const EditPublication: FC = () => {
  const { identifier } = useParams();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showForm, setShowForm] = useState(!!identifier);
  const { t } = useTranslation('publication');

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <PageHeader>{t(identifier ? 'edit_publication' : 'new_publication')}</PageHeader>
      {!showForm || !identifier ? (
        <>
          <StyledEditPublication>
            <StyledSelectorWrapper>
              <LinkPublication
                expanded={expanded === 'link-panel'}
                onChange={handleChange('link-panel')}
                openForm={handleClick}
              />
              <LoadPublication
                expanded={expanded === 'load-panel'}
                onChange={handleChange('load-panel')}
                openForm={() => setShowForm(true)}
              />
            </StyledSelectorWrapper>
            <StyledCard>
              <Typography variant="h5">{t('common:information')}</Typography>
              <Typography>{t('publication.info_text')}</Typography>
            </StyledCard>
          </StyledEditPublication>
        </>
      ) : (
        <PublicationForm identifier={identifier} closeForm={() => setShowForm(false)} />
      )}
    </>
  );
};

export default EditPublication;
