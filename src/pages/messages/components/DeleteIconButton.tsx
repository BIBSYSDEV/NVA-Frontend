import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

interface DeleteIconButtonProps extends IconButtonProps {
  tooltip?: string;
}

export const DeleteIconButton = ({ sx, tooltip, ...rest }: DeleteIconButtonProps) => (
  <Tooltip title={tooltip}>
    <IconButton
      sx={{
        bgcolor: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
        height: '1.5rem',
        width: '1.5rem',
        ...sx,
      }}
      {...rest}>
      <DeleteIcon
        sx={{
          color: 'white',
        }}
        fontSize="small"
      />
    </IconButton>
  </Tooltip>
);
