import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import DoiField from '../components/DoiField';
import PublisherField from '../components/PublisherField';
import { ReferenceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import IsbnListField from '../components/IsbnListField';
import TotalPagesField from '../components/TotalPagesField';
import { BookRegistration } from '../../../../types/registration.types';
import {
  BookEntityDescription,
  BookPublicationContext,
} from '../../../../types/publication_types/bookRegistration.types';
import PeerReview from '../components/PeerReview';
import { PublicationTableNumber } from '../../../../utils/constants';
import NviValidation from '../components/NviValidation';
import { formatPublicationContextWithPublisher, publicationContextToPublisher } from '../reference-helpers';

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

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const BookForm: FC = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values }: FormikProps<BookRegistration> = useFormikContext();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed },
    },
  } = values.entityDescription as BookEntityDescription;

  return (
    <>
      <DoiField />

      <Field name={contextTypeBaseFieldName}>
        {({ field: { name, value } }: FieldProps<BookPublicationContext>) => (
          <PublisherField
            publicationTable={PublicationTableNumber.PUBLISHERS}
            label={t('common:publisher')}
            placeholder={t('references.search_for_publisher')}
            errorFieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
            setValue={(newValue) => {
              const bookValues = formatPublicationContextWithPublisher(value.type, newValue);
              setFieldValue(name, bookValues);
            }}
            value={publicationContextToPublisher(value)}
          />
        )}
      </Field>

      <StyledSection>
        <IsbnListField />
        <TotalPagesField />
      </StyledSection>

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
      <div>
        <StyledTypography variant="h5">{t('references.series')}</StyledTypography>
        <Typography>{t('references.series_info')}</Typography>

        <Field name={ReferenceFieldNames.SERIES_TITLE}>
          {({ field: { name, value } }: FieldProps) => (
            <PublisherField
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              label={t('common:title')}
              placeholder={t('references.search_for_series')}
              errorFieldName={name}
              setValue={(newValue) => {
                setFieldValue(name, newValue?.title ?? '');
              }}
              value={publicationContextToPublisher({ title: value })}
            />
          )}
        </Field>
      </div>
      <NviValidation isPeerReviewed={peerReviewed} isRated={!!publicationContext?.level} dataTestId="nvi_book" />
    </>
  );
};

export default BookForm;
