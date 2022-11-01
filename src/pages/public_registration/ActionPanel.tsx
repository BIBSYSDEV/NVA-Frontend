import { Paper, Typography } from '@mui/material';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { useState, useEffect } from 'react';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { Registration } from '../../types/registration.types';
import { TabErrors, getTabErrors } from '../../utils/formik-helpers';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { ValidationAccordion } from './action_accordions/ValidationAccordion';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const ActionPanel = ({ registration }: PublicRegistrationContentProps) => {
  const [tabErrors, setTabErrors] = useState<TabErrors>();

  useEffect(() => {
    const publicationInstance = registration.entityDescription?.reference?.publicationInstance;
    const contentType =
      publicationInstance && 'contentType' in publicationInstance ? publicationInstance.contentType : null;
    try {
      validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration.status,
        contentType,
      });
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  return (
    <Paper elevation={0}>
      <StyledPaperHeader>
        <Typography color="inherit" variant="h2" component="h1">
          Handlinger
        </Typography>
      </StyledPaperHeader>
      <BackgroundDiv>{tabErrors && <ValidationAccordion errors={tabErrors} />}</BackgroundDiv>
    </Paper>
  );
};
