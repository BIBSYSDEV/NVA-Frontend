import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { mainTheme } from '../../../themes/mainTheme';

interface Props extends IconButtonProps {
  tooltip?: string;
}

export const DeleteIconButton = ({ sx, tooltip, ...rest }: Props) => (
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
