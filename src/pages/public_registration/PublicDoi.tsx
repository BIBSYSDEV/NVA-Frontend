import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getAssociatedLinks, userCanEditRegistration } from '../../utils/registration-helpers';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicDoi = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();
  const { user } = useSelector((store: RootState) => store);

  const nvaDoi = registration.doi;
  const originalDoi = registration.entityDescription?.reference?.doi ?? '';
  const associatedLink = getAssociatedLinks(registration.associatedArtifacts)[0]?.id;

  const [nvaDoiIsFindable, setNvaDoiIsFindable] = useState<boolean | undefined>(
    !nvaDoi || registration.status === RegistrationStatus.Draft ? false : undefined
  );

  useEffect(() => {
    const lookupNvaDoi = async () => {
      if (nvaDoi && registration.status === RegistrationStatus.Published) {
        try {
          const doiHeadResponse = await fetch(nvaDoi, { method: 'HEAD', redirect: 'manual' });
          if (doiHeadResponse.status === 404) {
            setNvaDoiIsFindable(false);
          } else {
            setNvaDoiIsFindable(true);
          }
        } catch {
          setNvaDoiIsFindable(false);
        }
      }
    };
    lookupNvaDoi();
  }, [nvaDoi, registration.status]);

  const canSeeDraftDoi = userCanEditRegistration(user, registration);
  const canSeeNvaDoi = nvaDoi && (nvaDoiIsFindable || canSeeDraftDoi);

  return (
    <>
      {(originalDoi || associatedLink) && (
        <>
          <Typography variant="overline">{t('registration.registration.link_to_resource')}</Typography>
          <Typography>
            <Link
              data-testid={dataTestId.registrationLandingPage.doiOriginalLink}
              href={originalDoi || associatedLink}
              target="_blank"
              rel="noopener noreferrer">
              {originalDoi || associatedLink}
            </Link>
          </Typography>
        </>
      )}
      {canSeeNvaDoi && (
        <>
          <Typography variant="overline">{t('common.doi')}</Typography>
          <Typography>
            <Link
              data-testid={dataTestId.registrationLandingPage.doiLink}
              href={nvaDoi}
              target="_blank"
              rel="noopener noreferrer">
              {nvaDoi}
            </Link>
            {canSeeDraftDoi &&
              nvaDoiIsFindable === false && ( // Note: Must check explicitly for false, since it is undefined initially
                <Box component="span" sx={{ ml: '0.5rem' }}>
                  (
                  {registration.status === RegistrationStatus.Published
                    ? t('registration.public_page.in_progress')
                    : t('registration.public_page.reserved_doi')}
                  )
                </Box>
              )}
          </Typography>
        </>
      )}
    </>
  );
};
