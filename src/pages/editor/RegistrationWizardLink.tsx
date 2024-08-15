import { Link as MuiLink, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrationWizardPath } from '../../utils/urlPaths';
import { PreviousPathLocationState } from '../../types/locationState.types';

interface RegistrationWizardLinkProps {
  identifier: string;
  children: ReactNode;
  sx?: SxProps;
}

export const RegistrationWizardLink = ({ identifier, children, sx }: RegistrationWizardLinkProps) => {
  return (
    <MuiLink
      sx={sx}
      component={Link}
      to={{
        pathname: getRegistrationWizardPath(identifier),
        state: {
          previousPath: `${window.location.pathname}${window.location.search}`,
        } satisfies PreviousPathLocationState,
      }}>
      {children}
    </MuiLink>
  );
};
