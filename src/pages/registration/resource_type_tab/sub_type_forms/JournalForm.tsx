import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { JournalType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';
import { NviFields } from '../components/nvi_fields/NviFields';
import { JournalArticleContentType } from '../../../../types/publication_types/content.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { JournalField } from '../components/JournalField';
import { dataTestId } from '../../../../utils/dataTestIds';

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

export const JournalForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<JournalRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />

        {publicationInstance.type === JournalType.Corrigendum ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.CorrigendumFor}
            searchSubtypes={[JournalType.Article]}
            label={t('resource_type.original_article_title')}
            placeholder={t('resource_type.search_for_original_article')}
            dataTestId="article-search-field"
          />
        ) : (
          <JournalField />
        )}

        <StyledArticleDetail>
          <Field name={ResourceFieldNames.Volume}>
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

          <Field name={ResourceFieldNames.Issue}>
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

          <Field name={ResourceFieldNames.PagesFrom}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
                variant="filled"
                label={t('resource_type.pages_from')}
                {...field}
                value={field.value ?? ''}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.PagesTo}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.pagesToField}
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

          <Field name={ResourceFieldNames.ArticleNumber}>
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

      {publicationInstance.type === JournalType.Article && (
        <>
          <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
            <NviFields contentTypes={Object.values(JournalArticleContentType)} />
          </BackgroundDiv>
          <NviValidation isPeerReviewed={!!publicationInstance.peerReviewed} isRated={!!publicationContext?.level} />
        </>
      )}
    </>
  );
};
