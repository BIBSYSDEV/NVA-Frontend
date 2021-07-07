import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { IsbnListField } from '../components/IsbnListField';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { TotalPagesField } from '../components/TotalPagesField';

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

export const ReportForm = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <StyledSection>
          <IsbnListField />
          <TotalPagesField />
        </StyledSection>
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>
    </>
  );
};
