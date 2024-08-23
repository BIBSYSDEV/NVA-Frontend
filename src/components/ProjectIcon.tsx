import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box } from '@mui/material';

export const ProjectIcon = () => {
  return (
    <Box
      sx={{
        bgcolor: 'project.main',
        borderRadius: '0.4rem',
        height: '1.6rem',
        width: '1.6rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ShowChartIcon />
    </Box>
  );
};
