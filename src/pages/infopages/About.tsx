import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BackgroundDiv from '../../components/BackgroundDiv';
import { PageHeader } from '../../components/PageHeader';
import AboutContent from './AboutContent';

const StyledAboutContainer = styled.div`
  display: block;
  ul {
    margin-top: 0;
  }
`;

const About = () => {
  const { t } = useTranslation('about');

  return (
    <BackgroundDiv>
      <PageHeader>{t('about_heading')}</PageHeader>
      <StyledAboutContainer>
        <AboutContent />
      </StyledAboutContainer>
    </BackgroundDiv>
  );
};

export default About;
