import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import DoiField from '../components/DoiField';
import SeriesField from '../components/SeriesField';
import PublisherField from '../components/PublisherField';

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const DegreeForm: FC = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <DoiField />

      <PublisherField />

      <StyledTypography variant="h5">{t('references.series')}</StyledTypography>
      <Typography>{t('references.series_info')}</Typography>
      <SeriesField />
    </>
  );
};

export default DegreeForm;
