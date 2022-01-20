import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Box, Button, Radio, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createAuthority } from '../../../api/authorityApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { User } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

interface NewAuthorityCardProps {
  user: User;
  onClickCancel: () => void;
}

export const NewAuthorityCard = ({ onClickCancel, user }: NewAuthorityCardProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('profile');
  const hasMatchingAuthorities = user.possibleAuthorities.length > 0;
  const { familyName, givenName, id, name } = user;

  const handleCreateAuthority = async () => {
    setIsLoading(true);
    const createAuthorityResponse = await createAuthority(givenName, familyName, id, user.cristinId);
    if (isErrorStatus(createAuthorityResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_authority'), 'error'));
      onClickCancel();
    } else if (isSuccessStatus(createAuthorityResponse.status)) {
      dispatch(setAuthorityData(createAuthorityResponse.data));
      dispatch(setNotification(t('feedback:success.created_authority')));
    }

    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: {
          xs: "'authority' 'description' 'create-button' 'cancel-button'",
          sm: `
          'authority authority authority'
          'description description description'
          'cancel-button . create-button'`,
        },
        gridTemplateColumns: { xs: '1fr', sm: '1fr 3fr auto' },
        gap: '1rem',
      }}>
      <Box sx={{ gridArea: 'authority' }}>
        <Radio checked />
        <Typography sx={{ display: 'inline-grid' }}>{name}</Typography>
      </Box>
      <Typography sx={{ whiteSpace: 'pre-wrap', gridArea: 'description', mx: '0.7rem' }}>
        {hasMatchingAuthorities
          ? t('authority.description_create_own_authority')
          : t('authority.description_no_authority_found')}
      </Typography>
      <LoadingButton
        data-testid="create-author-button"
        variant="contained"
        size="large"
        loading={isLoading}
        onClick={handleCreateAuthority}
        sx={{ gridArea: 'create-button' }}>
        {t('authority.create_authority')}
      </LoadingButton>
      {hasMatchingAuthorities && (
        <Button
          data-testid="cancel-create-author-button"
          variant="outlined"
          size="large"
          disabled={isLoading}
          onClick={onClickCancel}
          sx={{ gridArea: 'cancel-button' }}>
          {t('common:cancel')}
        </Button>
      )}
    </Box>
  );
};
