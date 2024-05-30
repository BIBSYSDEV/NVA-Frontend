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
        bgcolor: mainTheme.palette.primary.main,
        '&:hover': {
          bgcolor: mainTheme.palette.primary.main,
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
