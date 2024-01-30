import { Registration, RegistrationStatus } from '../../types/registration.types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { visuallyHidden } from '@mui/utils';

interface DeletePublicationInformationProps {
  registration: Registration;
}

export const DeletedPublicationInformation = ({ registration }: DeletePublicationInformationProps) => {
  const { t } = useTranslation();
  return (
    <>
      {(registration.status === RegistrationStatus.Deleted ||
        registration.status === RegistrationStatus.Unpublished) && (
        <Box
          aria-hidden="true" // works in pair with DeletedPublicationScreenReaderInformation
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'registration.main',
            padding: '1rem',
            gap: '1.5rem',
            my: '1rem',
          }}>
          <Typography variant="h2" component="h1">
            {t('registration.result_is_deleted')}
          </Typography>
        </Box>
      )}
    </>
  );
};

export const DeletedPublicationScreenReaderInformation = ({ registration }: DeletePublicationInformationProps) => {
  const { t } = useTranslation();
  return registration.status === RegistrationStatus.Deleted ||
    registration.status === RegistrationStatus.Unpublished ? (
    <span style={visuallyHidden}>{t('registration.result_is_deleted')}</span>
  ) : null;
};
