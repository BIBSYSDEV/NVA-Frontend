import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

import { FormikPublication } from '../../../types/publication.types';
import { BookFieldNames, BookType, emptyPublisher } from '../../../types/references.types';
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

const StyledSection = styled.div`
  display: grid;
  grid-template-areas: 'peer-review text-book';
  grid-template-columns: 1fr 2fr;
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  padding-left: 0.7rem;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledPeerReview = styled.div`
  grid-area: peer-review;
`;

const StyledTextBook = styled.div`
  grid-area: text-book;
`;

const BookReferenceForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();

  const isRatedBook = values.entityDescription.publisher?.level;
  const isPeerReviewed = values.entityDescription.peerReview;

  return (
    <>
      <SelectTypeField
        fieldName={BookFieldNames.SUB_TYPE}
        options={Object.values(BookType)}
        i18nKeyPrefix="referenceTypes:subtypes_book."
      />

      <DoiField />

      <PublisherField
        fieldName={BookFieldNames.PUBLISHER}
        label={t('common:publisher')}
        placeholder={t('references.search_for_publisher')}
      />

      <Field name={BookFieldNames.ISBN}>
        {({ field }: FieldProps) => (
          <TextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
        )}
      </Field>
      <StyledSection>
        <StyledPeerReview>
          <PeerReview fieldName={BookFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
        </StyledPeerReview>
        <StyledTextBook>
          <Field name={BookFieldNames.TEXT_BOOK}>
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
      <Field name={BookFieldNames.NUMBER_OF_PAGES}>
        {({ field }: FieldProps) => (
          <TextField
            data-testid="number_of_pages"
            variant="outlined"
            label={t('references.number_of_pages')}
            {...field}
          />
        )}
      </Field>
      <SubHeading>{t('references.series')}</SubHeading>
      <Label>{t('references.series_info')}</Label>
      <Field name={BookFieldNames.SERIES}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              dataTestId="autosearch-series"
              clearSearchField={value === emptyPublisher}
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              placeholder={t('references.search_for_series')}
            />
            {value.title && (
              <PublisherRow
                dataTestId="autosearch-results-series"
                label={t('common:title')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <NviValidation isPeerReviewed={!!isPeerReviewed} isRated={!!isRatedBook} dataTestId="nvi_book" />
    </>
  );
};

export default BookReferenceForm;
