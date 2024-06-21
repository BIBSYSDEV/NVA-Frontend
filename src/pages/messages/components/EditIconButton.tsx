import EditIcon from '@mui/icons-material/Edit';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

interface DeleteIconButtonProps extends IconButtonProps {
  tooltip?: string;
}

export const EditIconButton = ({ sx, tooltip, ...rest }: DeleteIconButtonProps) => (
  <Tooltip title={tooltip}>
    <IconButton
      sx={{
        bgcolor: 'secondary.main',
        '&:hover': {
          bgcolor: 'secondary.dark',
        },
        height: '1.5rem',
        width: '1.5rem',
        ...sx,
      }}
      {...rest}>
      <EditIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
    </IconButton>
  </Tooltip>
);
