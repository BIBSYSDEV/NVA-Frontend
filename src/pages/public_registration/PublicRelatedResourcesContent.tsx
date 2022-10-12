import { CircularProgress, Link, List, ListItem, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { apiRequest } from '../../api/apiRequest';
import { Registration } from '../../types/registration.types';
import { isSuccessStatus } from '../../utils/constants';
import { getTitleString } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface PublicRelatedPublicationsProps {
  links?: string[];
  emptyMessage: string;
  loadingLabel: string;
}

export const PublicRelatedPublications = ({
  links = [],
  emptyMessage,
  loadingLabel,
}: PublicRelatedPublicationsProps) => {
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [relatedRegistrations, setRelatedRegistrations] = useState<Registration[]>([]);

  const getRelatedRegistrations = useCallback(async () => {
    setIsLoadingRegistrations(true);
    const relatedRegistrationsPromises = links.map(async (id) => {
      const registrationResponse = await apiRequest<Registration>({ url: id });
      if (isSuccessStatus(registrationResponse.status)) {
        return registrationResponse.data;
      }
    });
    const registrations = (await Promise.all(relatedRegistrationsPromises)).filter(
      (registration) => registration // Remove null/undefined objects
    ) as Registration[];
    setRelatedRegistrations(registrations);
    setIsLoadingRegistrations(false);
  }, [links]);

  useEffect(() => {
    getRelatedRegistrations();
  }, [getRelatedRegistrations]);

  return links.length === 0 ? (
    <Typography>{emptyMessage}</Typography>
  ) : isLoadingRegistrations ? (
    <CircularProgress aria-label={loadingLabel} />
  ) : (
    <List>
      {relatedRegistrations.map((registration) => (
        <ListItem key={registration.identifier}>
          <Link component={RouterLink} to={getRegistrationLandingPagePath(registration.identifier)}>
            {getTitleString(registration.entityDescription?.mainTitle)}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

type PublicExternalRelationsProps = Pick<PublicRelatedPublicationsProps, 'links'>;

export const PublicExternalRelations = ({ links = [] }: PublicExternalRelationsProps) => {
  const { t } = useTranslation();

  return links.length === 0 ? (
    <Typography>{t('registration.resource_type.research_data.no_external_links')}</Typography>
  ) : (
    <List>
      {links.map((link) => (
        <ListItem key={link}>
          <Link href={link}>{link}</Link>
        </ListItem>
      ))}
    </List>
  );
};
