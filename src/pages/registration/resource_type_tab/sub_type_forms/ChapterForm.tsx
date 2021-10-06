import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RemoveIcon from '@mui/icons-material/Remove';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { StyledCenterAlignedContentWrapper } from '../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType, ChapterType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';
import { NviFields } from '../components/nvi_fields/NviFields';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { ChapterContentType } from '../../../../types/publication_types/content.types';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledDiv = styled(StyledCenterAlignedContentWrapper)`
  gap: 1rem;
`;

const StyledPageNumberWrapper = styled.div`
  display: grid;
  grid-template-areas: 'pages-from dash pages-to';
  grid-template-columns: max-content 3rem max-content;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'pages-from' 'dash' 'pages-to';
    grid-template-columns: auto;
  }
`;

const StyledDashIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledPageNumberField = styled(TextField)`
  display: inline;
  width: fit-content;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
    width: auto;
  }
`;

export const ChapterForm = () => {
  const { t } = useTranslation('registration');

  const { values } = useFormikContext<ChapterRegistration>();
  const { publicationInstance } = values.entityDescription.reference;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <StyledDiv data-testid="info-anthology">
          <InfoIcon color="primary" />
          <Typography variant="body1">{t('resource_type.chapter.info_anthology')}</Typography>
        </StyledDiv>

        <DoiField />

        {publicationInstance.type === ChapterType.AnthologyChapter && (
          <SearchContainerField
            fieldName={ResourceFieldNames.PartOf}
            searchSubtypes={[BookType.Anthology]}
            label={t('resource_type.chapter.published_in')}
            placeholder={t('resource_type.chapter.search_for_anthology')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback:error.get_monograph')}
          />
        )}
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <StyledPageNumberWrapper>
          <Field name={ResourceFieldNames.PagesFrom}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledPageNumberField
                id={field.name}
                variant="filled"
                data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
                label={t('resource_type.pages_from')}
                {...field}
                value={field.value ?? ''}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <StyledDashIconWrapper>
            <RemoveIcon color="primary" />
          </StyledDashIconWrapper>

          <Field name={ResourceFieldNames.PagesTo}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledPageNumberField
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
        </StyledPageNumberWrapper>
      </BackgroundDiv>

      {publicationInstance.type === ChapterType.AnthologyChapter && (
        <>
          <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
            <NviFields contentTypes={Object.values(ChapterContentType)} />
          </BackgroundDiv>

          <NviValidation registration={values} />
        </>
      )}
    </>
  );
};
