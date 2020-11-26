import { Field, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import { JournalRegistration } from '../../../../types/registration.types';
import { JournalType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import DoiField from '../components/DoiField';
import NviValidation from '../components/NviValidation';
import { JournalEntityDescription } from '../../../../types/publication_types/journalRegistration.types';
import JournalField from '../components/JournalField';

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

const JournalForm: FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<JournalRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as JournalEntityDescription;

  return (
    <>
      <DoiField />

      <JournalField />

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

      {(publicationInstance.type === JournalType.ARTICLE ||
        publicationInstance.type === JournalType.SHORT_COMMUNICATION) && (
        <NviValidation
          isPeerReviewed={publicationInstance.peerReviewed}
          isRated={!!publicationContext?.level}
          dataTestId="nvi_journal"
        />
      )}
    </>
  );
};

export default JournalForm;
