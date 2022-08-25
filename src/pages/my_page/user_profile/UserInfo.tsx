import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { User } from '../../../types/user.types';

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h2" paragraph>
        {t('my_page.my_profile.heading.user_info')}
      </Typography>
      <LabelTextLine dataTestId="user-name" label={t('common.name')}>
        {user.name}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-id" label={t('my_page.my_profile.id')}>
        {user.id}
      </LabelTextLine>
    </div>
  );
};

interface LabelTextLineProps {
  label: string;
  children?: ReactNode;
  dataTestId?: string;
}

const LabelTextLine = ({ label, children, dataTestId }: LabelTextLineProps) => (
  <Box sx={{ paddingBottom: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
    <Typography sx={{ width: '6rem', minWidth: '6rem' }}>{label}:</Typography>
    {children && <Typography data-testid={dataTestId}>{children}</Typography>}
  </Box>
);
