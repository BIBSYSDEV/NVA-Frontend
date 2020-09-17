import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkPublication from './new_publication/LinkPublication';
import LoadPublication from './new_publication/LoadPublication';
import PublicationForm from './PublicationForm';
import Card from '../../components/Card';
import { StyledCenterAlignedContentWrapper } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { Typography } from '@material-ui/core';

const StyledEditPublication = styled(StyledCenterAlignedContentWrapper)`
  width: 100%;
  padding-top: 2rem;
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
  max-height: 9rem;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: inherit;
    margin-right: 0;
  }
  > section {
    margin-bottom: 2rem;
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
              <LoadPublication
                expanded={expanded === 'load-panel'}
                onChange={handleChange('load-panel')}
                openForm={() => setShowForm(true)}
              />
              <LinkPublication
                expanded={expanded === 'link-panel'}
                onChange={handleChange('link-panel')}
                openForm={handleClick}
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
