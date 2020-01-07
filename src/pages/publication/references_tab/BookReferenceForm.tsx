import { Field, FormikProps, useFormikContext } from 'formik';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { emptyPublisher, PublicationFormsData } from '../../../types/form.types';
import { BookFieldNames, bookTypes } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './PublicationChannelSearch';

const StyledSection = styled.div`
  display: grid;
  grid-template-areas: 'peer-review text-book';
  grid-template-columns: 1fr 2fr;
  margin-top: 1rem;
`;

const StyledPeerReview = styled.div`
  grid-area: 'peer-review';
`;

const StyledTextBook = styled.div`
  grid-area: 'text-book';
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

const StyledNviValidation = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon information';
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 1rem 0;
`;

const StyledNviHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  grid-area: header;
`;

const StyledNviInformation = styled.div`
  grid-area: information;
`;

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  grid-area: icon;
  color: green;
  margin: 1rem;
  font-size: 2rem;
`;

const StyledCancelIcon = styled(CancelIcon)`
  grid-area: icon;
  color: red;
  margin: 1rem;
  font-size: 2rem;
`;

const BookReferenceForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue, values }: FormikProps<PublicationFormsData> = useFormikContext();

  const isRatedBook = values.reference?.book?.publisher?.level && values.reference.book.publisher.level !== '0';

  const isPeerReviewed = values.reference.book.peerReview;

  return (
    <>
      <Field name={BookFieldNames.TYPE}>
        {({ field: { onChange, name, value } }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select value={value} onChange={onChange(name, value)}>
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
              label={t('references.publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={value => setFieldValue(name, value ?? emptyPublisher)}
            />
            {value.title && (
              <JournalPublisherRow
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
        {({ field }: any) => <TextField variant="outlined" label={t('references.isbn')} {...field} />}
      </Field>
      <StyledSection>
        <StyledPeerReview>
          <Field name={BookFieldNames.PEER_REVIEW}>
            {({ field }: any) => (
              <PeerReview field={field} label={t('references.peer_review')} setFieldValue={setFieldValue} />
            )}
          </Field>
        </StyledPeerReview>
        <StyledTextBook>
          <Field name={BookFieldNames.TEXT_BOOK}>
            {({ field: { name, value } }: any) => (
              <>
                <StyledLabel>{t('references.text_book')}</StyledLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setFieldValue(name, event.target.checked)}
                      checked={value || false}
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
        {({ field }: any) => <TextField variant="outlined" label={t('references.number_of_pages')} {...field} />}
      </Field>
      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
      <Field name={BookFieldNames.SERIES}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={value => setFieldValue(name, value ?? emptyPublisher)}
            />
            {value.title && (
              <JournalPublisherRow
                hidePublisher
                label={t('common:title')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <StyledNviValidation>
        <StyledNviHeader>{t('references.nvi_header')}</StyledNviHeader>
        {isPeerReviewed ? (
          isRatedBook ? (
            <>
              <StyledCheckCircleIcon />
              <StyledNviInformation>{t('references.nvi_success')}</StyledNviInformation>
            </>
          ) : (
            <>
              <StyledCancelIcon />
              <StyledNviInformation>
                <div>{t('references.nvi_fail_rated_line1')}</div>
                <div>{t('references.nvi_fail_rated_line2')}</div>
              </StyledNviInformation>
            </>
          )
        ) : (
          <>
            <StyledCancelIcon />
            <StyledNviInformation>
              <div>{t('references.nvi_fail_no_peer_review')}</div>
            </StyledNviInformation>
          </>
        )}
      </StyledNviValidation>
    </>
  );
};

export default BookReferenceForm;
