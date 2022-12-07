import { Chip, Typography } from '@mui/material';
import { CristinProject } from '../../../../types/project.types';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface ProjectChipProps {
  id: string;
  fallbackName: string;
}

export const ProjectChip = ({ id, fallbackName, ...rest }: ProjectChipProps) => {
  const [project] = useFetchResource<CristinProject>(id);

  return (
    <Chip
      {...rest}
      data-testid={`project-chip-${id}`}
      label={
        <>
          <Typography variant="h3" component="h2">
            {project?.title ?? fallbackName}
          </Typography>
          {project && (
            <Typography variant="body2" color="textSecondary">
              {getLanguageString(project.coordinatingInstitution.name)}
            </Typography>
          )}
        </>
      }
    />
  );
};
