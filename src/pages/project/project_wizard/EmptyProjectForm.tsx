import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDuplicateProjectSearch } from '../../../api/hooks/useDuplicateProjectSearch';
import { StyledInfoBanner } from '../../../components/styled/Wrappers';
import { SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { ProjectListItem } from '../../search/project_search/ProjectListItem';
import { CreateProjectAccordion } from './CreateProjectAccordion';

interface EmptyProjectFormProps {
  newProject: SaveCristinProject;
  setNewProject: (val: SaveCristinProject) => void;
  setShowProjectForm: (val: boolean) => void;
}

export const EmptyProjectForm = ({ newProject, setNewProject, setShowProjectForm }: EmptyProjectFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const debouncedTitle = useDebounce(title);
  const titleSearch = useDuplicateProjectSearch(debouncedTitle);
  const disabled = !debouncedTitle || titleSearch.isPending;

  console.log('titleSearch', titleSearch);

  const createProject = () => {
    setNewProject({ ...newProject, title: title });
    setShowProjectForm(true);
  };

  return (
    <CreateProjectAccordion
      headline={t('project.form.start_with_empty_form_headline')}
      description={t('project.form.start_with_empty_form')}
      testId={dataTestId.newProjectPage.createEmptyProjectAccordion}
      icon={<InsertDriveFileOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          value={title}
          data-testid={dataTestId.newProjectPage.titleInput}
          variant="filled"
          onChange={(event) => setTitle(event.target.value)}
          InputProps={{
            endAdornment: titleSearch.isPending ? (
              <CircularProgress size={20} />
            ) : titleSearch.duplicateProject ? (
              <ErrorIcon color="warning" />
            ) : undefined,
          }}
          fullWidth
          placeholder={t('project.form.write_project_title')}
          label={t('common.title')}
        />
        {titleSearch.duplicateProject && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <StyledInfoBanner>{t('project.duplicate_project_warning')}</StyledInfoBanner>
            <ProjectListItem project={titleSearch.duplicateProject} />
          </Box>
        )}
        {debouncedTitle && !titleSearch.isPending && titleSearch.duplicateProject === undefined && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Typography sx={{ fontWeight: 'bold' }}>{t('common.result')}</Typography>
            <Typography>{t('project.no_duplicate_title')}</Typography>
          </Box>
        )}
        <Button
          variant="contained"
          sx={{ width: 'fit-content', alignSelf: 'end' }}
          disabled={disabled}
          onClick={createProject}
          data-testid={dataTestId.newProjectPage.startEmptyProjectButton}
          endIcon={<EastOutlinedIcon />}>
          {t('project.form.start_empty_project')}
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};
