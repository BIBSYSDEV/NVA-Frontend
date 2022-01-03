import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { LabelTextLine } from '../../components/LabelTextLine';
import { User } from '../../types/user.types';
import { BackgroundDiv } from '../../components/BackgroundDiv';

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const { t } = useTranslation('profile');

  return (
    <BackgroundDiv>
      <Typography variant="h2">{t('heading.user_info')}</Typography>
      <LabelTextLine dataTestId="user-name" label={t('common:name')}>
        {user.name}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-id" label={t('id')}>
        {user.id}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-email" label={t('common:email')}>
        {user.email}
      </LabelTextLine>
    </BackgroundDiv>
  );
};
