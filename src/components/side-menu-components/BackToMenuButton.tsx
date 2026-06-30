import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton, IconButtonProps } from '@mui/material';
import { Link, LinkProps } from 'react-router';

interface BackToMenuButtonProps extends IconButtonProps {
  to?: LinkProps['to'];
}

export const BackToMenuButton = ({ children, to, title, ...props }: BackToMenuButtonProps) => {
  return (
    <IconButton
      component={to ? Link : IconButton}
      to={to}
      aria-label={title}
      {...props}
      sx={(theme) => ({
        background: theme.palette.primary.main,
        ':hover': {
          background: theme.palette.secondary.main,
        },
        color: theme.palette.common.white,
        borderRadius: '0',
      })}>
      <ReplyIcon aria-hidden />
      {children}
    </IconButton>
  );
};
