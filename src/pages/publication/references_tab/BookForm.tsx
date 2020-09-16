import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BookPublication, emptyPagesMonograph } from '../../../types/publication.types';
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
import { BookEntityDescription } from '../../../types/publication_types/bookPublication.types';
import IsbnListField from './components/IsbnListField';
import TotalPagesField from './components/TotalPagesField';

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

const BookForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, touched, values }: FormikProps<BookPublication> = useFormikContext();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed },
    },
  } = values.entityDescription as BookEntityDescription;

  useEffect(() => {
    // set correct Pages type based on publication type being Book
    setFieldValue(ReferenceFieldNames.PAGES, emptyPagesMonograph, false);
  }, [setFieldValue]);

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(BookType)} />

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
      </StyledSection>
      <div>
        <SubHeading>{t('references.series')}</SubHeading>
        <Label>{t('references.series_info')}</Label>
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
    </StyledContent>
  );
};

export default BookForm;
