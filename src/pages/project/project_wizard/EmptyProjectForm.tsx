import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { CreateProjectAccordion } from './CreateProjectAccordion';

export const EmptyProjectForm = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const isSaving = false;
  const disabled = false;

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
        <LoadingButton
          variant="contained"
          sx={{ height: '2rem', width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          loading={isSaving}
          disabled={disabled}
          data-testid={dataTestId.newProjectPage.startEmptyProjectButton}>
          <>
            {t('project.form.start_empty_project')}
            <EastOutlinedIcon sx={{ width: '1rem', ml: '0.5rem' }} />
          </>
        </LoadingButton>
      </Box>
    </CreateProjectAccordion>
  );
};
