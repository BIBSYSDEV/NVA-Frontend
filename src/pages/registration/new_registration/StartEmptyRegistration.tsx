import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionActions, AccordionSummary, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RegistrationAccordion } from './RegistrationAccordion';
import { createRegistration } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { ButtonWithProgress } from '../../../components/ButtonWithProgress';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

const StyledRegistrationAccorion = styled(RegistrationAccordion)`
  border-color: ${({ theme }) => theme.palette.primary.main};
`;

interface StartEmptyRegistrationProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

export const StartEmptyRegistration = ({ expanded, onChange }: StartEmptyRegistrationProps) => {
  const { t } = useTranslation('registration');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createRegistrationWithFiles = async () => {
    setIsLoading(true);

    const createRegistrationResponse = await createRegistration();
    if (isErrorStatus(createRegistrationResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_registration'), NotificationVariant.Error));
      setIsLoading(false);
    } else if (isSuccessStatus(createRegistrationResponse.status)) {
      history.push(getRegistrationPath(createRegistrationResponse.data.identifier), { highestValidatedTab: -1 });
    }
  };

  return (
    <StyledRegistrationAccorion expanded={expanded} onChange={onChange}>
      <AccordionSummary data-testid="new-registration-empty" expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <InsertDriveFileIcon />
        <div>
          <Typography variant="h2">{t('registration.start_with_empty_registration_title')}</Typography>
          <Typography>{t('registration.start_with_empty_registration_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionActions>
        <ButtonWithProgress
          data-testid="registration-empty-start-button"
          endIcon={<ArrowForwardIcon fontSize="large" />}
          color="secondary"
          variant="contained"
          isLoading={isLoading}
          onClick={createRegistrationWithFiles}>
          {t('registration.start_registration')}
        </ButtonWithProgress>
      </AccordionActions>
    </StyledRegistrationAccorion>
  );
};
