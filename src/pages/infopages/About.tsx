import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
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
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('about_heading')}</PageHeader>
      <StyledAboutContainer>
        <AboutContent />
      </StyledAboutContainer>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default About;
