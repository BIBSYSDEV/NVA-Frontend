import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { CreateProjectAccordion } from './CreateProjectAccordion';

interface EmptyProjectFormProps {
  newProject: SaveCristinProject;
  setNewProject: (val: SaveCristinProject) => void;
  setShowProjectForm: (val: boolean) => void;
}

export const EmptyProjectForm = ({ newProject, setNewProject, setShowProjectForm }: EmptyProjectFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const disabled = !title;

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
          fullWidth
          placeholder={t('project.form.write_project_title')}
          label={t('common.title')}
        />
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
