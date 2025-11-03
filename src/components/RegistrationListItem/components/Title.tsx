import { Typography } from '@mui/material';
import { getTitleString } from '../../../utils/registration-helpers';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';

export const Title = () => {
  const { registration } = useContext(RegistrationListItemContext) ?? {};
  if (!registration) return null;

  return (
    <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordBreak: 'break-word' }}>
      {getTitleString(registration?.mainTitle)}
    </Typography>
  );
};
