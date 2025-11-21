import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AnnouncementFieldsProps {
  children: ReactNode;
}

export const AnnouncementsFieldsWrapper = ({ children }: AnnouncementFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.artistic.announcements')}
      </Typography>
      {children}
    </>
  );
};
