import { Field, FormikProps, useFormikContext } from 'formik';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import { PublicationFormsData } from '../../../types/form.types';
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

const BookReferenceForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<PublicationFormsData> = useFormikContext();

  return (
    <>
      <Field name={BookFieldNames.TYPE}>
        {({ field: { value, onChange } }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select value={value} onChange={onChange(BookFieldNames.TYPE, value)}>
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
        {({ field }: any) => (
          <>
            <PublicationChannelSearch
              label={t('references.publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={value => setFieldValue(BookFieldNames.PUBLISHER, value)}
            />
            {field.value && (
              <JournalPublisherRow
                hidePublisher
                label={t('references.publisher')}
                publisher={field.value}
                setValue={value => setFieldValue(field.name, value)}
              />
            )}
          </>
        )}
      </Field>
      <Field name={BookFieldNames.ISBN} component={TextField} variant="outlined" label={t('references.isbn')} />
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
            {({ field: { value } }: any) => (
              <>
                <StyledLabel>{t('references.text_book')}</StyledLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setFieldValue(BookFieldNames.TEXT_BOOK, event.target.checked)
                      }
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
      <Field
        name={BookFieldNames.NUMBER_OF_PAGES}
        component={TextField}
        variant="outlined"
        label={t('references.number_of_pages')}
      />
      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
      <Field name={BookFieldNames.SERIES}>
        {({ field }: any) => (
          <>
            <PublicationChannelSearch
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={value => setFieldValue(BookFieldNames.SERIES, value)}
            />
            {field.value && (
              <JournalPublisherRow
                hidePublisher
                label={t('common:title')}
                publisher={field.value}
                setValue={value => setFieldValue(field.name, value)}
              />
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default BookReferenceForm;
