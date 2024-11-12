import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NfrProject } from '../../../types/project.types';
import { getPeriodString } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NrfProjectOptionProps {
  project: NfrProject;
}

export const NfrProjectOption = ({ project }: NrfProjectOptionProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ fontWeight: 'bold' }}>{getLanguageString(project.labels)}</Typography>
      <Typography variant="body1">{getPeriodString(project.activeFrom, project.activeTo)}</Typography>
      <Typography variant="body2">{project.lead ? `${t('project.project_manager')}: ${project.lead}` : ''}</Typography>
    </Box>
  );
};
