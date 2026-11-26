import { Typography } from '@mui/material';
import { mathJaxContentClassName } from '../../../utils/mathJaxHelpers';
import { getTitleString } from '../../../utils/registration-helpers';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';

export const Title = () => {
  const { registration } = useContext(RegistrationListItemContext) ?? {};
  if (!registration) return null;

  return (
    <Typography
      gutterBottom
      className={mathJaxContentClassName}
      sx={{ fontSize: '1rem', fontWeight: '600', wordBreak: 'break-word' }}>
      {getTitleString(registration?.mainTitle)}
    </Typography>
  );
};
