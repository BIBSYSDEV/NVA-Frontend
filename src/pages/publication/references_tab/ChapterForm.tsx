import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { TextField } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import styled from 'styled-components';
import RemoveIcon from '@material-ui/icons/Remove';
import { ReferenceFieldNames } from '../../../types/publicationFieldNames';
import NviValidation from './components/NviValidation';
import DoiField from './components/DoiField';
import { ChapterPublication } from '../../../types/publication.types';
import PeerReview from './components/PeerReview';
import { ChapterEntityDescription } from '../../../types/publication_types/bookPublication.types';

const StyledInfoBox = styled.div`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 1rem 0;
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 1rem;
  font-size: 2rem;
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

const ChapterForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, touched, values }: FormikProps<ChapterPublication> = useFormikContext();
  const {
    reference: {
      publicationContext: { linkedContext },
      publicationInstance: { peerReviewed, textbookContent, type },
    },
  } = values.entityDescription as ChapterEntityDescription;

  return (
    <>
      <StyledInfoBox>
        <StyledIcon />
        {t('chapter.info')}
      </StyledInfoBox>

      <DoiField />

      {/* TODO <BookSearch /> */}

      <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />

      <StyledPageNumberWrapper>
        <Field name={ReferenceFieldNames.PAGES_FROM}>
          {({ field }: FieldProps) => (
            <StyledPageNumberField
              variant="outlined"
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
          {({ field }: FieldProps) => (
            <StyledPageNumberField
              data-testid="chapter-pages-to"
              variant="outlined"
              label={t('references.pages_to')}
              {...field}
              value={field.value ?? ''}
            />
          )}
        </Field>
      </StyledPageNumberWrapper>

      <NviValidation isPeerReviewed={peerReviewed} isRated={!!textbookContent} dataTestId="nvi-chapter" />
    </>
  );
};

export default ChapterForm;
