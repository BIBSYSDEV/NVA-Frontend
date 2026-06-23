import { PrimaryColoredBox } from '../../styles/header-styles';
import { sideNavHeaderId } from './_utils/side-menu-constants';
import { SvgIcon, Typography } from '@mui/material';

interface SideNavHeaderProps {
  icon?: typeof SvgIcon;
  text: string;
}

export const SideNavHeader = ({ icon: Icon, text }: SideNavHeaderProps) => {
  return (
    <PrimaryColoredBox sx={{ alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
      {Icon && <Icon sx={{ fontSize: '1.5rem' }} />}
      <Typography
        textTransform={'uppercase'}
        component="h2"
        fontWeight="bold"
        fontSize="1rem"
        id={sideNavHeaderId}
        sx={{ color: 'inherit' }}>
        {text}
      </Typography>
    </PrimaryColoredBox>
  );
};
