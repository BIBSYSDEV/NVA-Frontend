import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { Publication, BackendTypeNames } from '../../../types/publication.types';
import { ReferenceFieldNames, JournalType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';
import { JournalEntityDescription } from '../../../types/publication_types/journal.publication.types';

const StyledContent = styled.div`
  display: grid;
  gap: 1rem;
`;

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-areas: 'volume issue from to or article';
  grid-column-gap: 1rem;
  align-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'volume' 'issue' 'from' 'to' 'or' 'article';
  }
`;

const StyledLabel = styled.div`
  margin-top: 1rem;
  align-self: center;
  justify-self: center;
`;

const JournalForm: FC = () => {
  const { t } = useTranslation('publication');
  const { values, setFieldValue }: FormikProps<Publication> = useFormikContext();
  const {
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed },
    },
  } = values.entityDescription as JournalEntityDescription;

  useEffect(() => {
    // set correct Pages type based on publication type being Journal
    setFieldValue(ReferenceFieldNames.PAGES_TYPE, BackendTypeNames.PAGES_RANGE);
  }, [setFieldValue]);

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(JournalType)} />

      <DoiField />

      <PublisherField
        publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
        label={t('references.journal')}
        placeholder={t('references.search_for_journal')}
      />

      <StyledArticleDetail>
        <Field name={ReferenceFieldNames.VOLUME}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <TextField
              data-testid="volume-field"
              variant="outlined"
              label={t('references.volume')}
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <Field name={ReferenceFieldNames.ISSUE}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <TextField
              data-testid="issue-field"
              variant="outlined"
              label={t('references.issue')}
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <Field name={ReferenceFieldNames.PAGES_FROM}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <TextField
              data-testid="pages-from-field"
              variant="outlined"
              label={t('references.pages_from')}
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <Field name={ReferenceFieldNames.PAGES_TO}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <TextField
              data-testid="pages-to-field"
              variant="outlined"
              label={t('references.pages_to')}
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <StyledLabel>{t('references.or')}</StyledLabel>

        <Field name={ReferenceFieldNames.ARTICLE_NUMBER}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <TextField
              data-testid="article-number-field"
              variant="outlined"
              label={t('references.article_number')}
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </StyledArticleDetail>
      <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
      <NviValidation isPeerReviewed={peerReviewed} isRated={!!publicationContext?.level} dataTestId="nvi_journal" />
    </StyledContent>
  );
};

export default JournalForm;
