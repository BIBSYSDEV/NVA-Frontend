import { LinkProps, Link, Typography } from '@mui/material';

export const SkipLink = ({ children, ...props }: LinkProps) => (
  <Link
    underline="none"
    sx={{
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '3rem',
      background: 'black',
      clipPath: 'circle(0%)',

      ':focus': {
        position: 'static',
        clipPath: 'none',
      },
    }}
    {...props}>
    <Typography
      sx={{
        color: 'white',
        outline: '3px solid orange',
        outlineOffset: '3px',
      }}>
      {children}
    </Typography>
  </Link>
);
