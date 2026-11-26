import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import { LicenseInfo } from '../../../../types/license.types';

interface LicenseMenuItemContentProps {
  license: LicenseInfo;
}

/**
 * Logo and name of one license, as shown inside a license option in the license menu.
 *
 * Rendered as the children of a `MenuItem` rather than wrapping one, since MUI's `Select` reads `value` off
 * its direct children and clones them with the props that drive selection and keyboard navigation.
 * Only the Creative Commons licenses have a logo, so the icon slot is left out entirely for the rest.
 */
export const LicenseMenuItemContent = ({ license }: LicenseMenuItemContentProps) => (
  <>
    {license.logo && (
      <ListItemIcon>
        <img style={{ width: '5rem' }} src={license.logo} alt="" />
      </ListItemIcon>
    )}
    <ListItemText>
      <Typography>{license.name}</Typography>
    </ListItemText>
  </>
);
