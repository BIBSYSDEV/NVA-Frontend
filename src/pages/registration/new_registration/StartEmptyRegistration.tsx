import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { AccordionSummary, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { RegistrationFormLocationState } from '../../../types/locationState.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { StartRegistrationAccordionProps } from './LinkRegistration';
import { RegistrationAccordion } from './RegistrationAccordion';

const labelId = 'start-empty-label';

export const StartEmptyRegistration = ({ onChange }: Pick<StartRegistrationAccordionProps, 'onChange'>) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createEmptyRegistration = async () => {
    setIsLoading(true);
    const createRegistrationResponse = await createRegistration();
    if (isErrorStatus(createRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_registration'), variant: 'error' }));
      setIsLoading(false);
    } else if (isSuccessStatus(createRegistrationResponse.status)) {
      navigate(getRegistrationWizardPath(createRegistrationResponse.data.identifier), {
        state: { skipInitialValidation: true } satisfies RegistrationFormLocationState,
      });
    }
  };

  return (
    <RegistrationAccordion elevation={5} onChange={onChange} onClick={createEmptyRegistration}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.emptyRegistrationAccordion}
        sx={{ display: 'flex', alignItems: 'center' }}>
        <InsertDriveFileIcon />
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h2" component="span" id={labelId}>
            {t('registration.registration.start_with_empty_registration_title')}
          </Typography>
          <Typography component="span">
            {t('registration.registration.start_with_empty_registration_description')}
          </Typography>
        </span>
        {isLoading && <CircularProgress aria-labelledby={labelId} sx={{ marginLeft: 'auto' }} />}
      </AccordionSummary>
    </RegistrationAccordion>
  );
};
