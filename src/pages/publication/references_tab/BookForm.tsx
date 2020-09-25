import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BookPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, BookType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';
import { BookEntityDescription } from '../../../types/publication_types/bookPublication.types';
import IsbnListField from './components/IsbnListField';
import TotalPagesField from './components/TotalPagesField';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import ChapterForm from './ChapterForm';

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

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const BookForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, touched, values }: FormikProps<BookPublication> = useFormikContext();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed, type },
    },
  } = values.entityDescription as BookEntityDescription;

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(BookType)} />

      {type === BookType.CHAPTER ? (
        <ChapterForm />
      ) : (
        <>
          <DoiField />

          <PublisherField
            label={t('common:publisher')}
            placeholder={t('references.search_for_publisher')}
            touched={touched.entityDescription?.reference?.publicationContext?.publisher}
            errorName={ReferenceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
          />
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
                <>
                  <PublicationChannelSearch
                    dataTestId="autosearch-series"
                    clearSearchField={value === ''}
                    label={t('common:title')}
                    publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
                    setValueFunction={(inputValue) => setFieldValue(name, inputValue.title ?? '')}
                    placeholder={t('references.search_for_series')}
                  />
                  {value && (
                    <PublisherRow
                      dataTestId="autosearch-results-series"
                      label={t('common:title')}
                      publisher={{ title: value }}
                      onClickDelete={() => setFieldValue(name, '')}
                    />
                  )}
                </>
              )}
            </Field>
          </div>
          <NviValidation isPeerReviewed={peerReviewed} isRated={!!publicationContext?.level} dataTestId="nvi_book" />
        </>
      )}
    </StyledContent>
  );
};

export default BookForm;
