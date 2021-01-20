import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import theme from '../../../../themes/mainTheme';
import DoiField from '../components/DoiField';
import IsbnListField from '../components/IsbnListField';
import PublisherField from '../components/PublisherField';
import SeriesField from '../components/SeriesField';
import TotalPagesField from '../components/TotalPagesField';

const StyledSection = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-areas: 'isbn number-of-pages';
  grid-template-columns: 1fr 2fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'isbn' 'number-of-pages';
    grid-template-columns: 1fr;
  }
`;

const ReportForm = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <DoiField />
        <PublisherField />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={theme.palette.section.dark}>
        <StyledSection>
          <IsbnListField />
          <TotalPagesField />
        </StyledSection>
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={theme.palette.sectionMega.dark}>
        <Typography color="primary" variant="h5">
          {t('references.series')}
        </Typography>
        <Typography color="primary">{t('references.series_info')}</Typography>
        <SeriesField />
      </BackgroundDiv>
    </>
  );
};

export default ReportForm;
