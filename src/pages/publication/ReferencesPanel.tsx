import { FormikProps, useFormikContext } from 'formik';
import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormikPublication } from '../../types/publication.types';
import { PublicationType, ReferenceFieldNames } from '../../types/publicationFieldNames';
import BookForm from './references_tab/BookForm';
import ChapterForm from './references_tab/ChapterForm';
import DegreeForm from './references_tab/DegreeForm';
import JournalArticleForm from './references_tab/JournalArticleForm';
import ReportForm from './references_tab/ReportForm';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import SelectTypeField from './references_tab/components/SelectTypeField';
import { touchedReferenceTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;

const StyledSelectContainer = styled.div`
  width: 50%;
`;

const ReferencesPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched, setFieldValue }: FormikProps<FormikPublication> = useFormikContext();
  const publicationContextType = values.entityDescription.reference.publicationContext.type;

  useEffect(
    // Set all fields as touched if user navigates away from this panel (on unmount)
    () => () => setTouchedFields(touchedReferenceTabFields),
    [setTouchedFields]
  );

  return (
    <>
      <StyledSelectContainer>
        <SelectTypeField
          dataTestId="publication-context-type"
          fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TYPE}
          options={Object.values(PublicationType)}
          onChangeType={(newPublicationContextType) => {
            // Ensure some values are reset when publication type changes
            setFieldValue(ReferenceFieldNames.SUB_TYPE, '');
            setFieldValue(ReferenceFieldNames.PUBLICATION_CONTEXT, { type: newPublicationContextType });
            // Avoid showing potential errors instantly
            Object.values(ReferenceFieldNames).forEach((fieldName) => setFieldTouched(fieldName, false));
          }}
        />
      </StyledSelectContainer>

      {publicationContextType && (
        <StyledCard>
          <Heading data-testid="publication-instance-type-heading">
            {t(`publicationTypes:${publicationContextType}`)}
          </Heading>
          {publicationContextType === PublicationType.BOOK && <BookForm />}
          {publicationContextType === PublicationType.CHAPTER && <ChapterForm />}
          {publicationContextType === PublicationType.REPORT && <ReportForm />}
          {publicationContextType === PublicationType.DEGREE && <DegreeForm />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && <JournalArticleForm />}
        </StyledCard>
      )}
    </>
  );
};

export default ReferencesPanel;
