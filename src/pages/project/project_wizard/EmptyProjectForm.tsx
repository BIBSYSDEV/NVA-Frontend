import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { CreateProjectAccordion } from './CreateProjectAccordion';

interface EmptyProjectFormProps {
  title: string;
  setTitle: (val: string) => void;
  setShowProjectForm: (val: boolean) => void;
}

export const EmptyProjectForm = ({ title, setTitle, setShowProjectForm }: EmptyProjectFormProps) => {
  const { t } = useTranslation();
  const disabled = !title;

  const createProject = () => setShowProjectForm(true);

  return (
    <CreateProjectAccordion
      headline={t('project.form.start_with_empty_form_headline')}
      description={t('project.form.start_with_empty_form')}
      testId={dataTestId.newProjectPage.createEmptyProjectAccordion}
      icon={<InsertDriveFileOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
          sx={{ width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          disabled={disabled}
          onClick={createProject}
          data-testid={dataTestId.newProjectPage.startEmptyProjectButton}>
          <>
            {t('project.form.start_empty_project')}
            <EastOutlinedIcon sx={{ width: '1rem', ml: '0.5rem' }} />
          </>
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};
