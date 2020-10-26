import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DoiField from '../components/DoiField';
import { Typography } from '@material-ui/core';
import IsbnListField from '../components/IsbnListField';
import TotalPagesField from '../components/TotalPagesField';
import SeriesField from '../components/SeriesField';
import PublisherField from '../components/PublisherField';

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

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const ReportForm: FC = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <DoiField />

      <PublisherField />

      <StyledSection>
        <IsbnListField />
        <TotalPagesField />
      </StyledSection>

      <StyledTypography variant="h5">{t('references.series')}</StyledTypography>
      <Typography>{t('references.series_info')}</Typography>
      <SeriesField />
    </>
  );
};

export default ReportForm;
