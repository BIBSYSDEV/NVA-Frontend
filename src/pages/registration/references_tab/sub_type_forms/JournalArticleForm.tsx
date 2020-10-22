import { FormikProps, useFormikContext, Field, FieldProps, ErrorMessage } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { JournalPublication } from '../../../../types/registration.types';
import { JournalEntityDescription } from '../../../../types/publication_types/journalPublication.types';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import PeerReview from '../components/PeerReview';
import NviValidation from '../components/NviValidation';
import DoiField from '../components/DoiField';
import PublisherField from '../components/PublisherField';
import { PublicationTableNumber } from '../../../../utils/constants';
import { TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-areas: 'volume issue from to or article';
  grid-column-gap: 1rem;
  align-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'volume' 'issue' 'from' 'to' 'or' 'article';
  }
`;

const StyledLabel = styled(Typography)`
  margin-top: 1rem;
  align-self: center;
  justify-self: center;
`;

const JournalArticleForm: FC = () => {
  const { t } = useTranslation('registration');
  const { values }: FormikProps<JournalPublication> = useFormikContext();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as JournalEntityDescription;

  return (
    <>
      <DoiField />

      <PublisherField
        publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
        label={t('references.journal')}
        placeholder={t('references.search_for_journal')}
        errorFieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TITLE}
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
              value={field.value ?? ''}
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
              value={field.value ?? ''}
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

      <NviValidation
        isPeerReviewed={publicationInstance.peerReviewed}
        isRated={!!publicationContext?.level}
        dataTestId="nvi_journal"
      />
    </>
  );
};

export default JournalArticleForm;
