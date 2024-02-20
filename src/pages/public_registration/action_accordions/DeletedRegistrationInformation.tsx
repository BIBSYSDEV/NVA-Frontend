import { Link, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistration } from '../../../api/registrationApi';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { StyledStatusMessageBox } from '../../messages/components/PublishingRequestMessagesColumn';

interface DeletedRegistrationInformationProps {
  registration: Registration;
}

export const DeletedRegistrationInformation = ({ registration }: DeletedRegistrationInformationProps) => {
  const { t } = useTranslation();
  const duplicateRegistrationQuery = useQuery({
    enabled: !!registration.duplicateOf,
    queryKey: ['registration', registration.duplicateOf],
    queryFn: () => fetchRegistration(registration.duplicateOf ?? ''),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const duplicateRegistrationTitle = duplicateRegistrationQuery.data?.entityDescription?.mainTitle;
  const unpublishingNote = registration.publicationNotes?.find((note) => note.type === 'UnpublishingNote');

  return (
    <StyledStatusMessageBox
      sx={{
        bgcolor: 'publishingRequest.main',
      }}>
      {(registration.status === RegistrationStatus.Unpublished ||
        registration.status === RegistrationStatus.Deleted) && (
        <Typography variant="h4" component="span" sx={{ textTransform: 'uppercase' }}>
          {t(`registration.status.${registration.status}`)}
        </Typography>
      )}

      {unpublishingNote?.note && <Typography>{unpublishingNote.note}</Typography>}
      {registration.duplicateOf && (
        <Typography aria-busy={duplicateRegistrationQuery.isFetching} aria-live="polite">
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
