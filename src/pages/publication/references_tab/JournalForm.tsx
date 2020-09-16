import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { JournalPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, JournalType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import { JournalEntityDescription } from '../../../types/publication_types/journalPublication.types';
import PublisherField from './components/PublisherField';

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
  const { values, setFieldValue, touched }: FormikProps<JournalPublication> = useFormikContext();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as JournalEntityDescription;

  return (
    <StyledContent>
      <SelectTypeField
        fieldName={ReferenceFieldNames.SUB_TYPE}
        options={Object.values(JournalType)}
        onChangeType={(newType) => {
          setFieldValue(ReferenceFieldNames.SUB_TYPE, newType);
          // Only JournalArticle can be peer reviewed, so ensure it is set to false when type is changed
          setFieldValue(ReferenceFieldNames.PEER_REVIEW, false);
        }}
      />

      <DoiField />

      <PublisherField
        publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
        label={t('references.journal')}
        placeholder={t('references.search_for_journal')}
        touched={touched.entityDescription?.reference?.publicationContext?.title}
        errorName={ReferenceFieldNames.PUBLICATION_CONTEXT_TITLE}
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
      {publicationInstance.type === JournalType.ARTICLE && (
        <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
      )}
      <NviValidation
        isPeerReviewed={publicationInstance.peerReviewed}
        isRated={!!publicationContext?.level}
        dataTestId="nvi_journal"
      />
    </StyledContent>
  );
};

export default JournalForm;
