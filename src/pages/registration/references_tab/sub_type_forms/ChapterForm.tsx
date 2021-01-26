import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import RemoveIcon from '@material-ui/icons/Remove';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { StyledCenterAlignedContentWrapper } from '../../../../components/styled/Wrappers';
import lightTheme from '../../../../themes/lightTheme';
import { BookType, ChapterType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../../types/registration.types';
import DoiField from '../components/DoiField';
import NviValidation from '../components/NviValidation';
import PeerReview from '../components/PeerReview';
import SearchContainerField from '../components/SearchContainerField';

const StyledDiv = styled(StyledCenterAlignedContentWrapper)`
  gap: 1rem;
`;

const StyledPageNumberWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDashIconWrapper = styled.div`
  margin-right: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const StyledPageNumberField = styled(TextField)`
  margin-right: 1rem;
  width: 10rem;
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
          <Typography color="primary" variant="body1">
            {t('references.chapter.info_anthology')}
          </Typography>
        </StyledDiv>

        <DoiField />

        {publicationInstance.type === ChapterType.BOOK && (
          <SearchContainerField
            fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_LINKED_CONTEXT}
            searchSubtypes={[BookType.ANTHOLOGY]}
            label={t('references.chapter.published_in')}
            placeholder={t('references.chapter.search_for_anthology')}
          />
        )}
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <StyledPageNumberWrapper>
          <Field name={ReferenceFieldNames.PAGES_FROM}>
            {({ field }: FieldProps<string>) => (
              <StyledPageNumberField
                variant="filled"
                data-testid="chapter-pages-from"
                label={t('references.pages_from')}
                {...field}
                value={field.value ?? ''}
              />
            )}
          </Field>

          <StyledDashIconWrapper>
            <RemoveIcon />
          </StyledDashIconWrapper>

          <Field name={ReferenceFieldNames.PAGES_TO}>
            {({ field }: FieldProps<string>) => (
              <StyledPageNumberField
                data-testid="chapter-pages-to"
                variant="filled"
                label={t('references.pages_to')}
                {...field}
                value={field.value ?? ''}
              />
            )}
          </Field>
        </StyledPageNumberWrapper>
      </BackgroundDiv>

      {publicationInstance.type === ChapterType.BOOK && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
          <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
          <NviValidation
            isPeerReviewed={!!publicationInstance.peerReviewed}
            isRated={!!publicationContext?.level}
            dataTestId="nvi-chapter"
          />
        </BackgroundDiv>
      )}
    </>
  );
};

export default ChapterForm;
