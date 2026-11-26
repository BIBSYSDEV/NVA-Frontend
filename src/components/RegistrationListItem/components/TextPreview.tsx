import { mathJaxContentClassName } from '../../../utils/mathJaxHelpers';
import { TruncatableTypography } from '../../TruncatableTypography';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';

export const TextPreview = () => {
  const { registration } = useContext(RegistrationListItemContext) ?? {};
  if (!registration) return null;

  const text = registration?.abstract || registration?.description || '';

  return (
    <TruncatableTypography
      className={registration.abstract ? mathJaxContentClassName : undefined}
      sx={{ mt: '0.5rem', maxWidth: '60rem' }}>
      {text}
    </TruncatableTypography>
  );
};
