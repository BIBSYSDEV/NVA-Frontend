import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { getPublicationByDoi } from '../../../api/publicationApi';
import LinkPublicationForm, { DoiFormValues } from './LinkPublicationForm';
import PublicationAccordion from './PublicationAccordion';
import { Doi } from '../../../types/publication.types';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { doiValidationSchema } from '../../../utils/validation/doiSearchValidation';

const StyledBody = styled.div`
  width: 100%;
`;

const StyledTypography = styled(Typography)`
  margin: 1.5rem 0;
`;

interface LinkRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  openForm: () => void;
}

const LinkRegistration: FC<LinkRegistrationProps> = ({ expanded, onChange, openForm }) => {
  const { t } = useTranslation();
  const [doi, setDoi] = useState<Doi | null>(null);
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createPublication = async () => {
    if (!doi) {
      return;
    }
    history.push(`/registration/${doi.identifier}`);
    openForm();
  };

  const handleSearch = async (values: DoiFormValues) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
    const trimmedValues = doiValidationSchema.cast(values);
    const doiUrl = trimmedValues?.doiUrl as string;
    const decodedDoiUrl = decodeURIComponent(doiUrl);

    setNoHit(false);
    setDoi(null);

    const doiPublication = await getPublicationByDoi(decodedDoiUrl);
    if (doiPublication?.error) {
      setNoHit(true);
      dispatch(setNotification(t('feedback:error.get_doi'), NotificationVariant.Error));
    } else if (!doiPublication) {
      setNoHit(true);
    } else {
      setDoi(doiPublication);
    }
  };

  return (
    <PublicationAccordion
      headerLabel={t('registration:registration.start_with_link_to_resource')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link"
      dataTestId="new-publication-link">
      <StyledBody>
        <Typography>{t('registration:registration.link_to_resource_description')}</Typography>
        <LinkPublicationForm handleSearch={handleSearch} />
        {noHit && <Typography>{t('common:no_hits')}</Typography>}
        {doi && (
          <>
            <StyledTypography variant="h6">
              {t('registration:heading.registration')}: <b>{doi.title}</b>
            </StyledTypography>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={createPublication}
              data-testid="publication-link-next-button">
              {t('common:next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationAccordion>
  );
};

export default LinkRegistration;
