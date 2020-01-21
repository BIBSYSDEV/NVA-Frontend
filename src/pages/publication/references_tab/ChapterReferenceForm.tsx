import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormikProps, useFormikContext } from 'formik';
import { TextField } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { Publication } from '../../../types/publication.types';
import styled from 'styled-components';
import RemoveIcon from '@material-ui/icons/Remove';
import { ChapterFieldNames } from '../../../types/references.types';
import { AutoSearch } from '../../../components/AutoSearch';
import NviValidation from './components/NviValidation';

const ChapterReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

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

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const [isPeerReviewed, setIsPeerReviewed] = useState(true);
  const [isRatedBook, setIsRatedBook] = useState(true);

  return (
    <>
      <StyledInfoBox>
        <StyledIcon />
        {t('chapter.info')}
      </StyledInfoBox>

      <Field name={ChapterFieldNames.LINK}>
        {({ field }: any) => (
          <>
            <TextField
              aria-label="DOI-link"
              name="doiUrl"
              variant="outlined"
              fullWidth
              label={t('publication:chapter.link')}
            />
          </>
        )}
      </Field>

      <Field name={ChapterFieldNames.ANTHOLOGY}>
        {({ field: { name, value } }: any) => (
          <>
            <AutoSearch
              label={t('publication:chapter.anthology')}
              value={value}
              searchResults={() => {}}
              setValueFunction={() => {}}
            />
          </>
        )}
      </Field>

      <StyledPageNumberWrapper>
        <Field name={ChapterFieldNames.PAGES_FROM}>
          {({ field }: any) => (
            <StyledPageNumberField variant="outlined" label={t('references.pages_from')} {...field} />
          )}
        </Field>
        <StyledDashIconWrapper>
          <RemoveIcon />
        </StyledDashIconWrapper>
        <Field name={ChapterFieldNames.PAGES_TO}>
          {({ field }: any) => <StyledPageNumberField variant="outlined" label={t('references.pages_to')} {...field} />}
        </Field>
      </StyledPageNumberWrapper>

      <NviValidation isPeerReviewed={!!isPeerReviewed} isRated={!!isRatedBook} dataTestId="nvi_chapter" />
    </>
  );
};

export default ChapterReferenceForm;
