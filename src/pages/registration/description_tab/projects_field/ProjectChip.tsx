import { Chip, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { CristinProject } from '../../../../types/project.types';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface ProjectChipProps {
  id: string;
  fallbackName: string;
}

const wrapTypographyStyle: SxProps = {
  whiteSpace: 'normal',
};

export const ProjectChip = ({ id, fallbackName, ...rest }: ProjectChipProps) => {
  const [project] = useFetchResource<CristinProject>(id);

  return (
    <Chip
      {...rest}
      data-testid={`project-chip-${id}`}
      label={
        <>
          <Typography variant="subtitle1" sx={wrapTypographyStyle}>
            {project?.title ?? fallbackName}
          </Typography>
          {project && (
            <Typography variant="body2" color="textSecondary" sx={wrapTypographyStyle}>
              {getLanguageString(project.coordinatingInstitution.name)}
            </Typography>
          )}
        </>
      }
    />
  );
};
