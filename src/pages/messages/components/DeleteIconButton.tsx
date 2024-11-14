import CloseIcon from '@mui/icons-material/Close';
import { IconButton, IconButtonProps, SxProps, Tooltip } from '@mui/material';

interface DeleteIconButtonProps extends IconButtonProps {
  tooltip?: string;
  disabled?: boolean;
  sx?: SxProps;
}

export const DeleteIconButton = ({ sx, tooltip, disabled, ...rest }: DeleteIconButtonProps) => (
  <Tooltip title={tooltip}>
    <IconButton
      sx={{
        bgcolor: disabled ? 'grey.600' : 'primary.main',
        '&:hover': {
          bgcolor: disabled ? 'grey.600' : 'primary.main',
          opacity: disabled ? 1 : '0.85',
        },
        height: '1.5rem',
        width: '1.5rem',
        cursor: disabled ? 'auto' : 'pointer',
        ...sx,
      }}
      {...rest}>
      <CloseIcon
        sx={{
          color: 'white',
          height: '1rem',
          width: '1rem',
        }}
        fontSize="small"
      />
    </IconButton>
  </Tooltip>
);
