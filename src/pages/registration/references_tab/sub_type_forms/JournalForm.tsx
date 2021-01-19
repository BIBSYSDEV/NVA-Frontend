import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import theme from '../../../../themes/mainTheme';
import { JournalType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../../types/registration.types';
import DoiField from '../components/DoiField';
import JournalField from '../components/JournalField';
import NviValidation from '../components/NviValidation';
import PeerReview from '../components/PeerReview';
import SearchContainerField from '../components/SearchContainerField';

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

const JournalForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<JournalRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <DoiField />

        {publicationInstance.type === JournalType.CORRIGENDUM && (
          <SearchContainerField
            fieldName={ReferenceFieldNames.CORRIGENDUM_FOR}
            searchSubtypes={[JournalType.ARTICLE, JournalType.SHORT_COMMUNICATION]}
            label={t('references.original_article')}
            placeholder={t('references.search_for_original_article')}
          />
        )}
        {/* TODO: JournalField should be disabled for corrigendum and reflect value for original article (NP-1991) */}
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
      </BackgroundDiv>

      {(publicationInstance.type === JournalType.ARTICLE ||
        publicationInstance.type === JournalType.SHORT_COMMUNICATION) && (
        <BackgroundDiv backgroundColor={theme.palette.section.dark}>
          <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
          <NviValidation
            isPeerReviewed={publicationInstance.peerReviewed}
            isRated={!!publicationContext?.level}
            dataTestId="nvi_journal"
          />
        </BackgroundDiv>
      )}
    </>
  );
};

export default JournalForm;
