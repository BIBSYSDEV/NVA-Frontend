import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, AccordionSummary, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { RegistrationAccordion } from './RegistrationAccordion';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { StartRegistrationAccordionProps } from './LinkRegistration';

export const StartEmptyRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createEmptyRegistration = async () => {
    setIsLoading(true);
    const createRegistrationResponse = await createRegistration();
    if (isErrorStatus(createRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_registration'), variant: 'error' }));
      setIsLoading(false);
    } else if (isSuccessStatus(createRegistrationResponse.status)) {
      history.push(getRegistrationWizardPath(createRegistrationResponse.data.identifier), { highestValidatedTab: -1 });
    }
  };

  return (
    <RegistrationAccordion elevation={5} expanded={expanded} onChange={onChange} sx={{ borderColor: 'primary.main' }}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.emptyRegistrationAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <InsertDriveFileIcon />
        <div>
          <Typography variant="h2">{t('registration.registration.start_with_empty_registration_title')}</Typography>
          <Typography>{t('registration.registration.start_with_empty_registration_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionActions>
        <LoadingButton
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          loadingPosition="end"
          variant="contained"
          loading={isLoading}
          onClick={createEmptyRegistration}>
          {t('registration.registration.start_registration')}
        </LoadingButton>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
