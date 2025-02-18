import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { AccordionSummary, CircularProgress } from '@mui/material';
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
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontWeight: '600',
              fontSize: '1.125rem',
              lineHeight: '1.2',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
            id={labelId}>
            {t('registration.registration.start_with_empty_registration_title')}
          </span>
          <span>{t('registration.registration.start_with_empty_registration_description')}</span>
        </span>
        {isLoading && <CircularProgress aria-labelledby={labelId} />}
      </AccordionSummary>
    </RegistrationAccordion>
  );
};
