import { Box, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistration } from '../../../api/registrationApi';
import { Registration, RegistrationStatus } from '../../../types/registration.types';

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

  const duplicateRegistrationTitle =
    duplicateRegistrationQuery.data?.entityDescription?.mainTitle ?? registration.duplicateOf;
  const unpublishingNote = registration.publicationNotes?.find((note) => note.type === 'UnpublishingNote');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.1rem',
        marginTop: '1rem',
      }}>
      <Box
        sx={{
          bgcolor: 'publishingRequest.main',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0.5rem 1rem',
          padding: '0.2rem 1rem',
          borderRadius: '4px',
        }}>
        {registration.status === RegistrationStatus.Unpublished && (
          <Typography variant="h4" component="span" sx={{ textTransform: 'uppercase' }}>
            {registration.status === RegistrationStatus.Unpublished ? 'Avpuplisert' : 'Slettet'}
          </Typography>
        )}

        {unpublishingNote?.note && <Typography>{unpublishingNote.note}</Typography>}
        {registration.duplicateOf && (
          <Typography>
            Siteringer vil vise til <Link href={registration.duplicateOf}>{duplicateRegistrationTitle}</Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};
