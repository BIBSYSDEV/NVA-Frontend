import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

import { Publication, emptyPublisher } from '../../../types/publication.types';
import { ReferenceFieldNames, BookType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import SubHeading from '../../../components/SubHeading';
import Label from '../../../components/Label';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';

const StyledContent = styled.div`
  display: grid;
  gap: 1rem;
`;

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

const StyledTextField = styled(TextField)`
  display: inline;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
  }
`;

const BookForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, values }: FormikProps<Publication> = useFormikContext();
  const {
    publicationContext,
    publicationInstance: { peerReviewed },
  } = values.entityDescription.reference;

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(BookType)} />

      <DoiField />

      <PublisherField label={t('common:publisher')} placeholder={t('references.search_for_publisher')} />
      <StyledSection>
        <Field name={ReferenceFieldNames.ISBN}>
          {({ field }: FieldProps) => (
            <StyledTextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
          )}
        </Field>

        <Field name={ReferenceFieldNames.NUMBER_OF_PAGES}>
          {({ field }: FieldProps) => (
            <StyledTextField
              inputProps={{ 'data-testid': 'number_of_pages' }}
              variant="outlined"
              label={t('references.number_of_pages')}
              {...field}
            />
          )}
        </Field>
      </StyledSection>

      <StyledSection>
        <StyledPeerReview>
          <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
        </StyledPeerReview>
        <StyledTextBook>
          <Field name={ReferenceFieldNames.TEXT_BOOK}>
            {({ field: { name, value } }: FieldProps) => (
              <>
                <Label>{t('references.is_text_book')}</Label>
                <FormControlLabel
                  control={
                    <Checkbox
                      data-testid="text_book"
                      color="primary"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setFieldValue(name, event.target.checked)}
                      checked={value}
                    />
                  }
                  label={t('references.text_book_yes')}
                />
              </>
            )}
          </Field>
        </StyledTextBook>
      </StyledSection>
      <div>
        <SubHeading>{t('references.series')}</SubHeading>
        <Label>{t('references.series_info')}</Label>
        <Field name={ReferenceFieldNames.SERIES_TITLE}>
          {({ field: { name, value } }: FieldProps) => (
            <>
              <PublicationChannelSearch
                dataTestId="autosearch-series"
                clearSearchField={value === emptyPublisher}
                label={t('common:title')}
                publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
                setValueFunction={(inputValue) => setFieldValue(name, inputValue.title ?? '')}
                placeholder={t('references.search_for_series')}
              />
              {value.title && (
                <PublisherRow
                  dataTestId="autosearch-results-series"
                  label={t('common:title')}
                  publisher={value}
                  onClickDelete={() => setFieldValue(name, '')}
                />
              )}
            </>
          )}
        </Field>
      </div>
      <NviValidation isPeerReviewed={peerReviewed} isRated={!!publicationContext?.level} dataTestId="nvi_book" />
    </StyledContent>
  );
};

export default BookForm;
