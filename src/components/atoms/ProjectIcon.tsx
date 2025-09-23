import ShowChartIcon from '@mui/icons-material/ShowChart';
import { BoxProps } from '@mui/material';

export const ProjectIcon = ({ sx = {} }: { sx?: BoxProps['sx'] }) => {
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
