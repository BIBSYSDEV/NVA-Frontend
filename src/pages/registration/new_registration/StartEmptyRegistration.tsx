import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { AccordionSummary, Box, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
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
        state: { highestValidatedTab: -1 },
      });
    }
  };

  return (
    <RegistrationAccordion elevation={5} onChange={onChange} onClick={createEmptyRegistration}>
      <AccordionSummary data-testid={dataTestId.registrationWizard.new.emptyRegistrationAccordion}>
        <InsertDriveFileIcon />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <Typography variant="h2" id={labelId}>
              {t('registration.registration.start_with_empty_registration_title')}
            </Typography>
            <Typography>{t('registration.registration.start_with_empty_registration_description')}</Typography>
          </div>
          {isLoading && <CircularProgress aria-labelledby={labelId} />}
        </Box>
      </AccordionSummary>
    </RegistrationAccordion>
  );
};
