import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Link, Typography } from '@mui/material';
import { RootState } from '../../redux/store';
import { DoiRequestStatus, Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';

interface PublicDoiProps {
  registration: Registration;
}

export const PublicDoi = ({ registration }: PublicDoiProps) => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootState) => store.user);

  const originalDoi = registration.entityDescription?.reference?.doi ?? '';
  const nvaDoi = registration.doi;
  const hasApprovedDoiRequest = registration.doiRequest?.status === DoiRequestStatus.Approved;
  const canSeeDraftDoi =
    user &&
    ((user.isCurator && registration.publisher.id === user.customerId) || user.id === registration.resourceOwner.owner);

  const doiToPresent = nvaDoi && (hasApprovedDoiRequest || canSeeDraftDoi) ? nvaDoi : originalDoi;
  const isDraftDoi = nvaDoi && !hasApprovedDoiRequest && canSeeDraftDoi;

  return doiToPresent ? (
    <>
      <Typography variant="overline">{t('registration.link_to_resource')}</Typography>
      <Typography>
        <Link
          data-testid={dataTestId.registrationLandingPage.doiLink}
          href={doiToPresent}
          target="_blank"
          rel="noopener noreferrer">
          {doiToPresent}
        </Link>
        {isDraftDoi && (
          <Box component="span" sx={{ ml: '0.5rem' }}>
            ({t('public_page.in_progess')})
          </Box>
        )}
      </Typography>
    </>
  ) : null;
};
