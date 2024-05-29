import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, IconButtonProps, SxProps, Tooltip } from '@mui/material';
import { mainTheme } from '../../../themes/mainTheme';

interface Props extends IconButtonProps {
  iconSx?: SxProps | undefined;
  tooltip?: string;
}

export const DeleteIconButton = ({ sx, iconSx, tooltip, ...rest }: Props) => (
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
          ...iconSx,
        }}
        fontSize="small"
      />
    </IconButton>
  </Tooltip>
);
