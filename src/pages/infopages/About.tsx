import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import { PageHeader } from '../../components/PageHeader';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const About = () => {
  const { t } = useTranslation('about');

  return (
    <>
      <PageHeader>{t('description')}</PageHeader>
    </>
  );
};

export default About;
