import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { ProfilePicture } from '../../../components/ProfilePicture';
import { Registration } from '../../../types/registration.types';
import { toDateString } from '../../../utils/date-helpers';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getFullName } from '../../../utils/user-helpers';
import { StyledStatusMessageBox } from '../../messages/components/PublishingRequestMessagesColumn';

interface DeletedRegistrationInformationProps {
  registration: Registration;
  unpublishingNote: UnpublishingNote;
}

export const DeletedRegistrationInformation = ({
  registration,
  unpublishingNote,
}: DeletedRegistrationInformationProps) => {
  const { t } = useTranslation();

  const duplicateRegistrationIdentifier = getIdentifierFromId(registration.duplicateOf ?? '');
  const duplicateRegistrationQuery = useFetchRegistration(duplicateRegistrationIdentifier);

  const senderQuery = useFetchUserQuery(unpublishingNote.createdBy ?? '');

  const person = senderQuery.data;
  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  const duplicateRegistrationTitle = duplicateRegistrationQuery.data?.entityDescription?.mainTitle;

  return (
    <StyledStatusMessageBox
      sx={{
        bgcolor: 'publishingRequest.main',
      }}>
      <Typography>{t(`registration.status.${registration.status}`)}</Typography>
      <Box sx={{ display: 'flex', minWidth: '6rem', gap: '0.5rem', alignItems: 'center' }}>
        {unpublishingNote.createdDate && <Typography>{toDateString(unpublishingNote.createdDate)}</Typography>}
        {senderQuery.isFetching ? (
          <Skeleton variant="circular" sx={{ width: '1.5rem', height: '1.5rem' }} />
        ) : (
          person && (
            <ProfilePicture
              sx={{ width: '1.5rem', height: '1.5rem' }}
              fullName={senderName}
              personId={person.cristinId ?? ''}
            />
          )
        )}
      </Box>

      {unpublishingNote?.note && <Typography sx={{ gridColumn: '1/3' }}>{unpublishingNote.note}</Typography>}
      {registration.duplicateOf && (
        <Typography sx={{ gridColumn: '1/3' }} aria-busy={duplicateRegistrationQuery.isFetching} aria-live="polite">
          {duplicateRegistrationQuery.isFetching ? (
            <Skeleton />
          ) : (
            <>
              {t('registration.citation_points_to')}{' '}
              <Link href={registration.duplicateOf}>{duplicateRegistrationTitle}</Link>
            </>
          )}
        </Typography>
      )}
    </StyledStatusMessageBox>
  );
};
