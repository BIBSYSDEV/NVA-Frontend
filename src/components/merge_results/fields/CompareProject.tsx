import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ResearchProject } from '../../../types/project.types';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { StyledCompareButton } from './CompareFiles';
import { ProjectBox } from './ProjectBox';

interface CompareProjectProps {
  sourceProject?: ResearchProject;
  targetProject?: ResearchProject;
  matchingTargetProjectIndex?: number;
}

export const CompareProject = ({
  sourceProject,
  targetProject,
  matchingTargetProjectIndex = -1,
}: CompareProjectProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext<Registration>();
  const { append, remove } = useFieldArray({ name: 'projects', control });

  const canCopyProject = !!sourceProject && !targetProject;
  const projectIsCopied = matchingTargetProjectIndex > -1;

  return (
    <>
      <ProjectBox projectId={sourceProject?.id} />

      {canCopyProject && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.copyValueButton}
          variant="contained"
          color="secondary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceProject)}>
          {t('add_project')}
        </StyledCompareButton>
      )}
      {projectIsCopied && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.resetValueButton}
          variant="outlined"
          color="secondary"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetProjectIndex)}>
          {t('reset')}
        </StyledCompareButton>
      )}

      <ProjectBox projectId={targetProject?.id} sx={{ gridColumn: { xs: 1, md: 3 } }} />
    </>
  );
};
