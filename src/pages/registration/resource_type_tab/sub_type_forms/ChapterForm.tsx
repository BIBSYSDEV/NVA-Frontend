import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import RemoveIcon from '@material-ui/icons/Remove';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { StyledCenterAlignedContentWrapper } from '../../../../components/styled/Wrappers';
import lightTheme from '../../../../themes/lightTheme';
import { BookType, ChapterType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../../types/registration.types';
import { DoiField } from '../components/DoiField';
import NviValidation from '../components/NviValidation';
import PeerReview from '../components/PeerReview';
import SearchContainerField from '../components/SearchContainerField';

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

const ChapterForm = () => {
  const { t } = useTranslation('registration');

  const { values } = useFormikContext<ChapterRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <StyledDiv>
          <InfoIcon color="primary" />
          <Typography variant="body1">{t('resource_type.chapter.info_anthology')}</Typography>
        </StyledDiv>

        <DoiField />

        {publicationInstance.type === ChapterType.BOOK && (
          <SearchContainerField
            fieldName={ResourceFieldNames.PUBLICATION_CONTEXT_LINKED_CONTEXT}
            searchSubtypes={[BookType.ANTHOLOGY]}
            label={t('resource_type.chapter.published_in')}
            placeholder={t('resource_type.chapter.search_for_anthology')}
          />
        )}
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <StyledPageNumberWrapper>
          <Field name={ResourceFieldNames.PAGES_FROM}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledPageNumberField
                id={field.name}
                variant="filled"
                data-testid="chapter-pages-from"
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

          <Field name={ResourceFieldNames.PAGES_TO}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledPageNumberField
                id={field.name}
                data-testid="chapter-pages-to"
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

      {publicationInstance.type === ChapterType.BOOK && (
        <>
          <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
            <PeerReview fieldName={ResourceFieldNames.PEER_REVIEW} label={t('resource_type.peer_review')} />
          </BackgroundDiv>

          <NviValidation
            isPeerReviewed={!!publicationInstance.peerReviewed}
            isRated={!!publicationContext?.level}
            dataTestId="nvi-chapter"
          />
        </>
      )}
    </>
  );
};

export default ChapterForm;
