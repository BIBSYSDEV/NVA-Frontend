import { useFormikContext } from 'formik';
import React, { useEffect, FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Registration } from '../../types/registration.types';
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
import { PanelProps } from './RegistrationFormContent';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;

const ReferencesPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('registration');
  const { values, setTouched, setFieldValue, touched } = useFormikContext<Registration>();
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
    setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
  };

  const onChangeSubType = (newInstanceType: string) => {
    switch (values.entityDescription.reference.publicationContext.type) {
      case PublicationType.PUBLICATION_IN_JOURNAL:
        setFieldValue(instanceTypeBaseFieldName, { ...emptyJournalPublicationInstance, type: newInstanceType }, false);
        break;
      case PublicationType.BOOK:
        setFieldValue(instanceTypeBaseFieldName, { ...emptyBookPublicationInstance, type: newInstanceType }, false);
        break;
      case PublicationType.REPORT:
        setFieldValue(instanceTypeBaseFieldName, { ...emptyReportPublicationInstance, type: newInstanceType }, false);
        break;
      case PublicationType.DEGREE:
        setFieldValue(instanceTypeBaseFieldName, { ...emptyDegreePublicationInstance, type: newInstanceType }, false);
        break;
    }

    // Avoid showing potential errors instantly
    setTouched({
      ...touched,
      entityDescription: {
        ...touched.entityDescription,
        reference: {},
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
          {publicationContextType === PublicationType.BOOK && <BookTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.REPORT && <ReportTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.DEGREE && <DegreeTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && (
            <JournalTypeForm onChangeSubType={onChangeSubType} />
          )}
        </StyledCard>
      )}
    </>
  );
};

export default ReferencesPanel;
