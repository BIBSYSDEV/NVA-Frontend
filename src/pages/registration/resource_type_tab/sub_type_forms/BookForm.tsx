import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/registration.types';
import { DoiField } from '../components/DoiField';
import { IsbnListField } from '../components/IsbnListField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { TotalPagesField } from '../components/TotalPagesField';
import { NviFields } from '../components/nvi_fields/NviFields';
import { ContentTypeField } from '../components/ContentTypeField';
import {
  bookMonographContentTypes,
  nviApplicableContentTypes,
} from '../../../../types/publication_types/content.types';

const StyledSection = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

export const BookForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<BookRegistration>();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed, type, contentType, originalResearch },
    },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />

        <MuiThemeProvider theme={lightTheme}>
          <NpiDisciplineField />
        </MuiThemeProvider>

        <StyledSection>
          <IsbnListField />
          <TotalPagesField />
        </StyledSection>
      </BackgroundDiv>

      {type === BookType.MONOGRAPH && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <ContentTypeField options={bookMonographContentTypes} />
          {nviApplicableContentTypes.includes(contentType as string) && <NviFields />}
        </BackgroundDiv>
      )}

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>

      {type === BookType.MONOGRAPH && (
        <NviValidation
          isPeerReviewed={!!peerReviewed}
          isRated={!!publicationContext?.level}
          isOriginalResearch={!!originalResearch}
        />
      )}
    </>
  );
};
