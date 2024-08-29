import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProjectIcon } from '../../../components/atoms/ProjectIcon';
import { ProjectStatus } from '../../../types/project.types';

interface ProjectIconHeaderProps {
  projectStatus?: ProjectStatus;
}

export const ProjectIconHeader = ({ projectStatus }: ProjectIconHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mb: '0.5rem' }}>
      <ProjectIcon />
      <Typography>{t('project.project')}</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>
        {projectStatus ? t(`project.status.${projectStatus}`).toUpperCase() : t('common.new').toUpperCase()}
      </Typography>
    </Box>
  );
};
