import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { associatedArtifactIsLink, userCanEditRegistration } from '../../utils/registration-helpers';
import { AssociatedLink } from '../../types/file.types';

interface PublicDoiProps {
  registration: Registration;
}

export const PublicDoi = ({ registration }: PublicDoiProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [nvaDoiIsFindable, setNvaDoiIsFindable] = useState<boolean>();

  const originalDoi = registration.entityDescription?.reference?.doi ?? '';
  const nvaDoi = registration.doi;
  const associatedLink = (registration.associatedArtifacts.find(associatedArtifactIsLink) as AssociatedLink | undefined)
    ?.id;

  useEffect(() => {
    const lookupNvaDoi = async () => {
      if (!nvaDoi) {
        setNvaDoiIsFindable(false);
      } else {
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
  }, [nvaDoi]);

  const canSeeDraftDoi = userCanEditRegistration(user, registration);
  const canSeeNvaDoi = nvaDoi && (nvaDoiIsFindable || canSeeDraftDoi);

  return !originalDoi && !associatedLink && !canSeeNvaDoi ? null : (
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
            {nvaDoiIsFindable === false && ( // Note: Must check explicitly for false, since it is undefined initially
              <Box component="span" sx={{ ml: '0.5rem' }}>
                ({t('registration.public_page.in_progress')})
              </Box>
            )}
          </Typography>
        </>
      )}
    </>
  );
};
