import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { fetchPerson } from '../../../api/cristinApi';
import { fetchRegistration } from '../../../api/registrationApi';
import { ProfilePicture } from '../../../components/ProfilePicture';
import { PublicationNote, Registration } from '../../../types/registration.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getFullCristinName } from '../../../utils/user-helpers';
import { StyledStatusMessageBox } from '../../messages/components/PublishingRequestMessagesColumn';

interface DeletedRegistrationInformationProps {
  registration: Registration;
  unpublishingNote: PublicationNote;
}

function extractId(createdBy: string) {
  return CristinApiPath.Person + createdBy.split('@')[0];
}

export const DeletedRegistrationInformation = ({
  registration,
  unpublishingNote,
}: DeletedRegistrationInformationProps) => {
  const { t } = useTranslation();

  const duplicateRegistrationIdentifier = getIdentifierFromId(registration.duplicateOf ?? '');

  const duplicateRegistrationQuery = useQuery({
    enabled: !!duplicateRegistrationIdentifier,
    queryKey: ['registration', duplicateRegistrationIdentifier],
    queryFn: () => fetchRegistration(duplicateRegistrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const cristinIdentifier = unpublishingNote.createdBy ? extractId(unpublishingNote.createdBy) : null;
  const personQuery = useQuery({
    queryKey: [cristinIdentifier],
    queryFn: () => fetchPerson(cristinIdentifier ?? ''),
    enabled: !!cristinIdentifier,
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const person = personQuery.data;

  const duplicateRegistrationTitle = duplicateRegistrationQuery.data?.entityDescription?.mainTitle;

  return (
    <StyledStatusMessageBox
      sx={{
        bgcolor: 'publishingRequest.main',
      }}>
      <Typography>{t(`registration.status.${registration.status}`)}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', minWidth: '6rem', gap: '0.5rem', alignItems: 'center' }}>
        {personQuery.isFetching ? (
          <Skeleton variant="circular" />
        ) : (
          person && (
            <ProfilePicture
              sx={{ width: '1.5rem', height: '1.5rem' }}
              fullName={getFullCristinName(person.names)}
              personId={person.id}
            />
          )
        )}

        {unpublishingNote.createdDate && (
          <Typography>{new Date(unpublishingNote.createdDate).toLocaleDateString()}</Typography>
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
