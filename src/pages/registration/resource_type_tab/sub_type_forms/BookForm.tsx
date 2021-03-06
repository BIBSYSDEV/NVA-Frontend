import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, MuiThemeProvider, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/registration.types';
import { DoiField } from '../components/DoiField';
import { IsbnListField } from '../components/IsbnListField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { PeerReviewedField } from '../components/PeerReviewedField';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { TotalPagesField } from '../components/TotalPagesField';

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
          {type === BookType.MONOGRAPH && (
            <div>
              <PeerReviewedField />
            </div>
          )}
          <div>
            <Typography variant="h5" component="p">
              {t('resource_type.is_book_a_textbook')}
            </Typography>
            <Field name={ResourceFieldNames.TEXTBOOK_CONTENT}>
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
          </div>
        </StyledSection>
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>

      {type === BookType.MONOGRAPH && (
        <NviValidation
          isPeerReviewed={!!peerReviewed}
          isRated={!!publicationContext?.level}
          isTextbook={!!textbookContent}
          dataTestId="nvi_book"
        />
      )}
    </>
  );
};
