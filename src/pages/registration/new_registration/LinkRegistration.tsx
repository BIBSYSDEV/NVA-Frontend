import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { AccordionActions, Button, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useDispatch } from 'react-redux';

import { getRegistrationByDoi } from '../../../api/registrationApi';
import LinkRegistrationForm, { DoiFormValues } from './LinkRegistrationForm';
import RegistrationAccordion from './RegistrationAccordion';
import { Doi } from '../../../types/registration.types';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { doiValidationSchema } from '../../../utils/validation/doiSearchValidation';
import { getRegistrationPath } from '../../../utils/urlPaths';

const StyledRegistrationAccorion = styled(RegistrationAccordion)`
  border-color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledResult = styled.div`
  margin-top: 1rem;
`;

interface LinkRegistrationProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

const LinkRegistration = ({ expanded, onChange }: LinkRegistrationProps) => {
  const { t } = useTranslation('common');
  const [doi, setDoi] = useState<Doi | null>(null);
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createRegistration = async () => {
    if (!doi) {
      return;
    }
    history.push(getRegistrationPath(doi.identifier), { isNewRegistration: true });
  };

  const handleSearch = async (values: DoiFormValues) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
    const trimmedValues = doiValidationSchema.cast(values);
    const doiUrl = trimmedValues?.doiUrl as string;
    const decodedDoiUrl = decodeURIComponent(doiUrl);

    setNoHit(false);
    setDoi(null);

    const doiRegistration = await getRegistrationByDoi(decodedDoiUrl);
    if (doiRegistration?.error) {
      setNoHit(true);
      dispatch(setNotification(t('feedback:error.get_doi'), NotificationVariant.Error));
    } else if (!doiRegistration) {
      setNoHit(true);
    } else {
      setDoi(doiRegistration);
    }
  };

  return (
    <StyledRegistrationAccorion
      summaryTitle={t('registration:registration.start_with_link_to_resource_title')}
      summaryDescription={t('registration:registration.start_with_link_to_resource_description')}
      icon={<LinkIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="registration-method-link"
      dataTestId="new-registration-link">
      <>
        <LinkRegistrationForm handleSearch={handleSearch} />
        <StyledResult>
          {noHit && <Typography>{t('no_hits')}</Typography>}
          {doi && (
            <>
              <Typography variant="subtitle1">{t('registration')}:</Typography>
              <Typography>{doi.title}</Typography>

              <AccordionActions>
                <Button
                  endIcon={<ArrowForwardIcon fontSize="large" />}
                  color="primary"
                  variant="contained"
                  onClick={createRegistration}
                  data-testid="registration-link-next-button">
                  {t('registration:registration.start_registration')}
                </Button>
              </AccordionActions>
            </>
          )}
        </StyledResult>
      </>
    </StyledRegistrationAccorion>
  );
};

export default LinkRegistration;
