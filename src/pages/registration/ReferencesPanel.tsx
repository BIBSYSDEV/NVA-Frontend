import { useFormikContext } from 'formik';
import React, { FC } from 'react';
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
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;

const ReferencesPanel: FC = () => {
  const { t } = useTranslation('registration');
  const { values, setTouched, setFieldValue, touched } = useFormikContext<Registration>();
  const publicationContextType = values.entityDescription.reference.publicationContext.type;

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
        reference: { publicationContext: { type: true } },
      },
    });
  };

  const onChangeSubType = (newInstanceType: string) => {
    setFieldValue(
      instanceTypeBaseFieldName,
      { ...values.entityDescription.reference.publicationInstance, type: newInstanceType },
      false
    );
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
