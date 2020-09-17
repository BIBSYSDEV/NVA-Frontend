import { FormikProps, useFormikContext } from 'formik';
import React, { useEffect, FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Publication } from '../../types/publication.types';
import {
  PublicationType,
  ReferenceFieldNames,
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
} from '../../types/publicationFieldNames';
import BookForm from './references_tab/BookForm';
// import ChapterForm from './references_tab/ChapterForm';
import DegreeForm from './references_tab/DegreeForm';
import JournalForm from './references_tab/JournalForm';
import ReportForm from './references_tab/ReportForm';
import Card from '../../components/Card';
import SelectTypeField from './references_tab/components/SelectTypeField';
import { touchedReferenceTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookPublication.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalPublication.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportPublication.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreePublication.types';

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;

const StyledSelectContainer = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

const ReferencesPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('publication');
  const { values, setTouched, setFieldValue, touched }: FormikProps<Publication> = useFormikContext();
  const publicationContextType = values.entityDescription.reference.publicationContext.type;
  const contextRef = useRef(publicationContextType);

  useEffect(() => {
    contextRef.current = publicationContextType;
  }, [publicationContextType]);

  useEffect(
    // Set all fields as touched if user navigates away from this panel (on unmount)
    () => () => setTouchedFields(touchedReferenceTabFields(contextRef.current)),
    [setTouchedFields]
  );

  const onChangeType = (newPublicationContextType: string) => {
    // Ensure some values are reset when publication type changes
    setFieldValue(contextTypeBaseFieldName, { type: newPublicationContextType }, false);

    switch (newPublicationContextType) {
      case PublicationType.PUBLICATION_IN_JOURNAL:
        setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
        break;
      case PublicationType.BOOK:
        setFieldValue(instanceTypeBaseFieldName, emptyBookPublicationInstance, false);
        break;
      case PublicationType.REPORT:
        setFieldValue(instanceTypeBaseFieldName, emptyReportPublicationInstance, false);
        break;
      case PublicationType.DEGREE:
        setFieldValue(instanceTypeBaseFieldName, emptyDegreePublicationInstance, false);
        break;
    }

    // Avoid showing potential errors instantly
    setTouched({
      ...touched,
      entityDescription: {
        ...touched.entityDescription,
        reference: {
          ...touched.entityDescription?.reference,
          publicationContext: {},
          publicationInstance: {},
        },
      },
    });
  };

  return (
    <>
      <StyledSelectContainer>
        <SelectTypeField
          dataTestId="publication-context-type"
          fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TYPE}
          options={Object.values(PublicationType)}
          onChangeType={onChangeType}
        />
      </StyledSelectContainer>

      {publicationContextType && (
        <StyledCard>
          <Typography variant="h2" data-testid="publication-instance-type-heading">
            {t(`publicationTypes:${publicationContextType}`)}
          </Typography>
          {publicationContextType === PublicationType.BOOK && <BookForm />}
          {/* {publicationContextType === PublicationType.CHAPTER && <ChapterForm />} */}
          {publicationContextType === PublicationType.REPORT && <ReportForm />}
          {publicationContextType === PublicationType.DEGREE && <DegreeForm />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && <JournalForm />}
        </StyledCard>
      )}
    </>
  );
};

export default ReferencesPanel;
