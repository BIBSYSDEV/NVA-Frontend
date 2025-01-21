import { Button, Typography } from '@mui/material';
import { Link } from 'react-router';

interface ReportButtonProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

export const ReportButton = ({ title, description, imageSrc, path }: ReportButtonProps) => (
  <Button
    component={Link}
    to={path}
    sx={{
      border: '2px solid',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      textTransform: 'none',
    }}>
    <img src={imageSrc} alt="" style={{ height: '9rem', width: '12rem' }} />
    <Typography variant="h3">{title}</Typography>
    <Typography>{description}</Typography>
  </Button>
);
