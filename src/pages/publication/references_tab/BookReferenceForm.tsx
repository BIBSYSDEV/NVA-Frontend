import { Field, FormikProps, useFormikContext } from 'formik';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import { Publication } from '../../../types/publication.types';
import { BookFieldNames, bookTypes, emptyPublisher } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './components/PublicationChannelSearch';

const StyledSection = styled.div`
  display: grid;
  grid-template-areas: 'peer-review text-book';
  grid-template-columns: 1fr 2fr;
  margin-top: 1rem;
`;

const StyledPeerReview = styled.div`
  grid-area: peer-review;
`;

const StyledTextBook = styled.div`
  grid-area: text-book;
`;

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const BookReferenceForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, values }: FormikProps<Publication> = useFormikContext();

  const isRatedBook = values.reference?.book?.publisher?.level;
  const isPeerReviewed = values.reference?.book?.peerReview;

  return (
    <>
      <Field name={BookFieldNames.TYPE}>
        {({ field }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select {...field}>
              {bookTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field name={BookFieldNames.PUBLISHER}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={t('references.publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
            />
            {value.title && (
              <JournalPublisherRow
                dataTestId="autosearch-results-publisher"
                hidePublisher
                label={t('references.publisher')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <Field name={BookFieldNames.ISBN}>
        {({ field }: any) => (
          <TextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
        )}
      </Field>
      <StyledSection>
        <StyledPeerReview>
          <PeerReview fieldName={BookFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
        </StyledPeerReview>
        <StyledTextBook>
          <Field name={BookFieldNames.TEXT_BOOK}>
            {({ field: { name, value } }: any) => (
              <>
                <StyledLabel>{t('references.text_book')}</StyledLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      data-testid="text_book"
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
        {({ field }: any) => (
          <TextField
            data-testid="number_of_pages"
            variant="outlined"
            label={t('references.number_of_pages')}
            {...field}
          />
        )}
      </Field>
      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
      <Field name={BookFieldNames.SERIES}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              dataTestId="autosearch-series"
              clearSearchField={value === emptyPublisher}
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
            />
            {value.title && (
              <JournalPublisherRow
                dataTestId="autosearch-results-series"
                hidePublisher
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
