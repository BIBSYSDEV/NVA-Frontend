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
import BookTypeForm from './references_tab/BookTypeForm';
import DegreeTypeForm from './references_tab/DegreeTypeForm';
import JournalTypeForm from './references_tab/JournalTypeForm';
import ReportTypeForm from './references_tab/ReportTypeForm';
import Card from '../../components/Card';
import SelectTypeField from './references_tab/components/SelectTypeField';
import { touchedReferenceTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookPublication.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalPublication.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportPublication.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreePublication.types';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';

const StyledCard = styled(Card)`
  margin-top: 1rem;
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
      <StyledSelectWrapper>
        <SelectTypeField
          dataTestId="publication-context-type"
          fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TYPE}
          options={Object.values(PublicationType)}
          onChangeType={onChangeType}
        />
      </StyledSelectWrapper>

      {publicationContextType && (
        <StyledCard>
          <Typography variant="h2" data-testid="publication-context-type-heading">
            {t(`publicationTypes:${publicationContextType}`)}
          </Typography>
          {publicationContextType === PublicationType.BOOK && <BookTypeForm />}
          {publicationContextType === PublicationType.REPORT && <ReportTypeForm />}
          {publicationContextType === PublicationType.DEGREE && <DegreeTypeForm />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && <JournalTypeForm />}
        </StyledCard>
      )}
    </>
  );
};

export default ReferencesPanel;
