import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { getRegistrationByDoi } from '../../../api/registrationApi';
import LinkRegistrationForm, { DoiFormValues } from './LinkRegistrationForm';
import RegistrationAccordion from './RegistrationAccordion';
import { Doi } from '../../../types/registration.types';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { doiValidationSchema } from '../../../utils/validation/doiSearchValidation';
import { getRegistrationPath } from '../../../utils/urlPaths';

const StyledTypography = styled(Typography)`
  margin: 1.5rem;
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
    <RegistrationAccordion
      headerLabel={t('registration:registration.start_with_link_to_resource')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="registration-method-link"
      dataTestId="new-registration-link">
      <>
        <Typography>{t('registration:registration.link_to_resource_description')}</Typography>
        <LinkRegistrationForm handleSearch={handleSearch} />
        {noHit && <Typography>{t('no_hits')}</Typography>}
        {doi && (
          <>
            <StyledTypography variant="h6">
              {t('registration')}: <b>{doi.title}</b>
            </StyledTypography>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={createRegistration}
              data-testid="registration-link-next-button">
              {t('registration:registration.start_registration')}
            </Button>
          </>
        )}
      </>
    </RegistrationAccordion>
  );
};

export default LinkRegistration;
