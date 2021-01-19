import { Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import theme from '../../../../themes/mainTheme';
import { BookType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/registration.types';
import DoiField from '../components/DoiField';
import IsbnListField from '../components/IsbnListField';
import NviValidation from '../components/NviValidation';
import PeerReview from '../components/PeerReview';
import PublisherField from '../components/PublisherField';
import SeriesField from '../components/SeriesField';
import TotalPagesField from '../components/TotalPagesField';

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

const BookForm: FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<BookRegistration>();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed, type },
    },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <DoiField />
        <PublisherField />

        <StyledSection>
          <IsbnListField />
          <TotalPagesField />
        </StyledSection>
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={theme.palette.section.dark}>
        <StyledSection>
          <StyledPeerReview>
            <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
          </StyledPeerReview>
          <StyledTextBook>
            <Typography variant="h5">{t('references.is_book_a_textbook')}</Typography>
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
                  label={t('references.is_book_a_textbook_confirm')}
                />
              )}
            </Field>
          </StyledTextBook>
        </StyledSection>
      </BackgroundDiv>

      {(type === BookType.ANTHOLOGY || type === BookType.MONOGRAPH) && (
        <BackgroundDiv backgroundColor={theme.palette.sectionMega.dark}>
          <Typography variant="h5">{t('references.series')}</Typography>
          <Typography>{t('references.series_info')}</Typography>
          <SeriesField />

          {type === BookType.MONOGRAPH && (
            <NviValidation isPeerReviewed={peerReviewed} isRated={!!publicationContext?.level} dataTestId="nvi_book" />
          )}
        </BackgroundDiv>
      )}
    </>
  );
};

export default BookForm;
