import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';

interface OpenInNewLinkWithReactRouterProps extends MuiLinkProps, Pick<LinkProps, 'to'> {
  component: typeof Link;
}

type OpenInNewLinkProps = MuiLinkProps | OpenInNewLinkWithReactRouterProps;

export const OpenInNewLink = ({ children, ...muiLinkProps }: OpenInNewLinkProps) => {
  return (
    <MuiLink target="_blank" rel="noopener noreferrer" {...muiLinkProps}>
      {children} <OpenInNewIcon fontSize="small" />
    </MuiLink>
  );
};
