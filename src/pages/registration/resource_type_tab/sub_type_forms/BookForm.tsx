import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, MuiThemeProvider, Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import lightTheme from '../../../../themes/lightTheme';
import { BookType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/registration.types';
import DoiField from '../components/DoiField';
import IsbnListField from '../components/IsbnListField';
import NviValidation from '../components/NviValidation';
import PeerReview from '../components/PeerReview';
import PublisherField from '../components/PublisherField';
import SeriesField from '../components/SeriesField';
import TotalPagesField from '../components/TotalPagesField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';

const StyledSection = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-areas: 'peer-review text-book';
  grid-template-columns: 1fr 2fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'peer-review' 'text-book';
    grid-template-columns: 1fr;
  }
`;

const StyledPeerReview = styled.div`
  grid-area: peer-review;
`;

const StyledTextBook = styled.div`
  grid-area: text-book;
`;

const BookForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<BookRegistration>();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed, textbookContent, type },
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

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <StyledSection>
          <StyledPeerReview>
            <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('resource_type.peer_review')} />
          </StyledPeerReview>
          <StyledTextBook>
            <Typography variant="h5">{t('resource_type.is_book_a_textbook')}</Typography>
            <Field name={ReferenceFieldNames.TEXTBOOK_CONTENT}>
              {({ field }: FieldProps) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      data-testid="is-textbook-checkbox"
                      color="primary"
                      checked={field.value ?? false}
                      {...field}
                    />
                  }
                  label={<Typography>{t('resource_type.is_book_a_textbook_confirm')}</Typography>}
                />
              )}
            </Field>
          </StyledTextBook>
        </StyledSection>
      </BackgroundDiv>

      {(type === BookType.ANTHOLOGY || type === BookType.MONOGRAPH) && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
          <Typography variant="h5">{t('resource_type.series')}</Typography>
          <Typography>{t('resource_type.series_info')}</Typography>
          <SeriesField />
        </BackgroundDiv>
      )}
      {type === BookType.MONOGRAPH && (
        <NviValidation
          isPeerReviewed={peerReviewed}
          isRated={!!publicationContext?.level}
          isTextbook={!!textbookContent}
          dataTestId="nvi_book"
        />
      )}
    </>
  );
};

export default BookForm;
