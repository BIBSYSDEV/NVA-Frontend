import { Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusChip } from '../../components/StatusChip';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getAssociatedLinks, userHasAccessRight } from '../../utils/registration-helpers';
import { PublicPageInfoEntry } from './PublicPageInfoEntry';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicDoi = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

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

  const canSeeDraftDoi = userHasAccessRight(registration, 'update');
  const canSeeNvaDoi = nvaDoi && (nvaDoiIsFindable || canSeeDraftDoi);

  return (
    <>
      {originalDoi && (
        <PublicPageInfoEntry
          title={t('registration.registration.link_to_resource')}
          content={
            <Typography component="dd" gridColumn={2} sx={{ wordBreak: 'break-all' }}>
              <Link
                data-testid={dataTestId.registrationLandingPage.doiOriginalLink}
                href={originalDoi}
                target="_blank"
                rel="noopener noreferrer">
                {originalDoi}
              </Link>
            </Typography>
          }
        />
      )}
      {canSeeNvaDoi && (
        <PublicPageInfoEntry
          title={t('common.doi')}
          content={
            <Box component="dd" gridColumn={2} sx={{ m: 0, display: 'flex', gap: '0.5rem' }}>
              <Typography data-testid={dataTestId.registrationLandingPage.doiLink}>
                {nvaDoiIsFindable ? (
                  <Link href={nvaDoi} target="_blank" rel="noopener noreferrer">
                    {nvaDoi}
                  </Link>
                ) : (
                  nvaDoi
                )}
              </Typography>
              {canSeeDraftDoi &&
                nvaDoiIsFindable === false && ( // Note: Must check explicitly for false, since it is undefined initially
                  <StatusChip
                    icon="hourglass"
                    paddingY={0}
                    text={
                      registration.status === RegistrationStatus.Published
                        ? t('my_page.messages.ticket_types.Pending')
                        : t('registration.public_page.tasks_panel.reserved')
                    }
                  />
                )}
            </Box>
          }
        />
      )}
    </>
  );
};
