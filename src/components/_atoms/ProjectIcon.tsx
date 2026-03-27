import ShowChartIcon from '@mui/icons-material/ShowChart';
import { SxProps } from '@mui/material';

export const ProjectIcon = ({ sx }: { sx?: SxProps }) => {
  return (
    <ShowChartIcon
      sx={{
        bgcolor: 'project.main',
        borderRadius: '0.4rem',
        color: 'black',
        ...sx,
      }}
    />
  );
};
