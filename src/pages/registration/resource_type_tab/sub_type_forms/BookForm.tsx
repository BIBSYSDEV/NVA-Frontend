import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SeriesFields } from '../components/SeriesFields';
import { TotalPagesField } from '../components/TotalPagesField';
import { NviFields } from '../components/nvi_fields/NviFields';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { IsbnField } from '../components/IsbnField';
import { BookMonographContentType } from '../../../../types/publication_types/content.types';
import { PublisherSearch } from '../components/PublisherSearch';

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
      publicationInstance: { peerReviewed, type, originalResearch },
    },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherSearch />

        <MuiThemeProvider theme={lightTheme}>
          <NpiDisciplineField />
        </MuiThemeProvider>

        <StyledSection>
          <IsbnField />
          <TotalPagesField />
        </StyledSection>
      </BackgroundDiv>

      {type === BookType.Monograph && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <NviFields contentTypes={Object.values(BookMonographContentType)} />
        </BackgroundDiv>
      )}

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>

      {type === BookType.Monograph && (
        <NviValidation
          isPeerReviewed={!!peerReviewed}
          isRated={!!publicationContext?.level}
          isOriginalResearch={!!originalResearch}
        />
      )}
    </>
  );
};
