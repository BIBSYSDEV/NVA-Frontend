import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Button, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RootState } from '../../redux/store';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getAssociatedLinks, userCanEditRegistration } from '../../utils/registration-helpers';
import { Ticket } from '../../types/publication_types/messages.types';

interface PublicDoiProps {
  registration: Registration;
  doiRequest?: Ticket;
  refetchData: () => void;
}

export const PublicDoi = ({ registration, doiRequest, refetchData }: PublicDoiProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [nvaDoiIsFindable, setNvaDoiIsFindable] = useState<boolean>();

  const originalDoi = registration.entityDescription?.reference?.doi ?? '';
  const nvaDoi = registration.doi;
  const associatedLink = getAssociatedLinks(registration.associatedArtifacts)[0]?.id;

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
                    : 'Reservert DOI'}
                  )
                </Box>
              )}
          </Typography>
        </>
      )}
      {canSeeDraftDoi && !nvaDoi && doiRequest?.status === 'Pending' && (
        <Button variant="outlined" size="small" onClick={refetchData} startIcon={<RefreshIcon />} sx={{ my: '0.5rem' }}>
          Last inn på nytt for å se reservert DOI
        </Button>
      )}
    </>
  );
};
