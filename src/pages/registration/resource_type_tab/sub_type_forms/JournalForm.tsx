import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { JournalType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../../types/registration.types';
import { DoiField } from '../components/DoiField';
import { JournalField } from '../components/JournalField';
import { NviValidation } from '../components/NviValidation';
import { PeerReviewedField } from '../components/PeerReviewedField';
import { SearchContainerField } from '../components/SearchContainerField';
import { ContentTypeField } from '../components/ContentTypeField';
import {
  JournalArticleContentType,
  journalArticleContentTypes,
} from '../../../../types/publication_types/journalRegistration.types';
import { OriginalResearchField } from '../components/OriginalResearchField';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-areas: 'volume issue from to or article';
  grid-column-gap: 1rem;
  align-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'volume' 'issue' 'from' 'to' 'or' 'article';
  }
`;

const StyledRadioGroup = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
  }

  legend {
    font-size: 1.25rem;
    font-weight: 700;
  }
`;

const StyledLabel = styled(Typography)`
  margin-top: 1rem;
  align-self: center;
  justify-self: center;
`;

export const JournalForm = () => {
  const { t } = useTranslation('registration');
  const { values, setFieldValue } = useFormikContext<JournalRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />

        {publicationInstance.type === JournalType.CORRIGENDUM ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.CORRIGENDUM_FOR}
            searchSubtypes={[JournalType.ARTICLE]}
            label={t('resource_type.original_article_title')}
            placeholder={t('resource_type.search_for_original_article')}
            dataTestId="article-search-field"
          />
        ) : (
          <JournalField />
        )}

        <StyledArticleDetail>
          <Field name={ResourceFieldNames.VOLUME}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid="volume-field"
                variant="filled"
                label={t('resource_type.volume')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.ISSUE}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid="issue-field"
                variant="filled"
                label={t('resource_type.issue')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.PAGES_FROM}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid="pages-from-field"
                variant="filled"
                label={t('resource_type.pages_from')}
                {...field}
                value={field.value ?? ''}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.PAGES_TO}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid="pages-to-field"
                variant="filled"
                label={t('resource_type.pages_to')}
                {...field}
                value={field.value ?? ''}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <StyledLabel color="primary">{t('resource_type.or')}</StyledLabel>

          <Field name={ResourceFieldNames.ARTICLE_NUMBER}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid="article-number-field"
                variant="filled"
                label={t('resource_type.article_number')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        </StyledArticleDetail>
      </BackgroundDiv>

      {publicationInstance.type === JournalType.ARTICLE && (
        <>
          <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
            <ContentTypeField
              options={journalArticleContentTypes}
              extendedOnChange={(value) => {
                if (
                  value !== JournalArticleContentType.ResearchArticle &&
                  value !== JournalArticleContentType.ReviewArticle
                ) {
                  setFieldValue(ResourceFieldNames.PEER_REVIEW, null);
                  setFieldValue(ResourceFieldNames.OriginalResearch, null);
                }
              }}
            />
            {(publicationInstance.content === JournalArticleContentType.ResearchArticle ||
              publicationInstance.content === JournalArticleContentType.ReviewArticle) && (
              <StyledRadioGroup>
                <PeerReviewedField />
                <OriginalResearchField />
              </StyledRadioGroup>
            )}
          </BackgroundDiv>
          <NviValidation
            isPeerReviewed={!!publicationInstance.peerReviewed}
            isRated={!!publicationContext?.level}
            dataTestId="nvi_journal"
          />
        </>
      )}
    </>
  );
};
