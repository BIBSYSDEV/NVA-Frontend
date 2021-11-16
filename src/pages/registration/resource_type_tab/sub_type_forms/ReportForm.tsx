import React from 'react';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const ReportForm = () => (
  <>
    <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
      <DoiField />
      <PublisherField />
    </BackgroundDiv>

    <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
      <IsbnAndPages />
    </BackgroundDiv>

    <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
      <SeriesFields />
    </BackgroundDiv>
  </>
);
