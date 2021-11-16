import React from 'react';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { InputContainerBox } from '../../../../components/styled/Wrappers';

interface DegreeFormProps {
  subType: DegreeType;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => (
  <>
    <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
      <InputContainerBox>
        <DoiField />
        <PublisherField />
        <IsbnAndPages />
      </InputContainerBox>
    </BackgroundDiv>

    {subType === DegreeType.Phd && (
      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <SeriesFields />
      </BackgroundDiv>
    )}
  </>
);
