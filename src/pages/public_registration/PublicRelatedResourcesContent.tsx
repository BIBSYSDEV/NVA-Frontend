import { CircularProgress, Link, List, ListItem, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { apiRequest } from '../../api/apiRequest';
import { Registration } from '../../types/registration.types';
import { API_URL, isSuccessStatus } from '../../utils/constants';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface PublicRelatedResourcesContentProps {
  related: string[];
}

export const PublicRelatedResourcesContent = ({ related = [] }: PublicRelatedResourcesContentProps) => {
  const { t } = useTranslation();
  const internalResources = useMemo(() => related.filter((uri) => uri.includes(API_URL)), [related]);
  const externalResources = related.filter((uri) => !uri.includes(API_URL));

  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [relatedRegistrations, setRelatedRegistrations] = useState<Registration[]>([]);

  const getRelatedRegistrations = useCallback(async () => {
    setIsLoadingRegistrations(true);
    const relatedRegistrationsPromises = internalResources.map(async (id) => {
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
  }, [internalResources]);

  useEffect(() => {
    getRelatedRegistrations();
  }, [getRelatedRegistrations]);

  return related.length === 0 ? (
    <Typography>{t('registration.resource_type.research_data.no_related_links')}</Typography>
  ) : (
    <>
      {internalResources.length > 0 &&
        (isLoadingRegistrations ? (
          <CircularProgress
            aria-label={t('registration.resource_type.research_data.related_links')}
            sx={{ display: 'block' }}
          />
        ) : (
          <List>
            {relatedRegistrations.map((registration) => (
              <ListItem key={registration.identifier}>
                <Link component={RouterLink} to={getRegistrationLandingPagePath(registration.identifier)}>
                  {registration.entityDescription?.mainTitle}
                </Link>
              </ListItem>
            ))}
          </List>
        ))}
      {externalResources.length > 0 && (
        <>
          <Typography variant="overline">{t('registration.resource_type.research_data.external_links')}</Typography>
          <List>
            {externalResources.map((externalResource) => (
              <ListItem key={externalResource}>
                <Link href={externalResource}>{externalResource}</Link>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
};
