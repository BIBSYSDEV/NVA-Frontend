import { Box, Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';
import { SaveCristinProject, NfrProject, emptyProject } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface CreateProjectStartPageProps {
  onClose: () => void;
  setInitialValues: (project: SaveCristinProject) => void;
}

export const CreateProjectStartPage = ({ onClose, setInitialValues }: CreateProjectStartPageProps) => {
  const { t } = useTranslation();

  const [selectedNfrProject, setSelectedNfrProject] = useState<NfrProject | null>(null);
  const [emptyProjectSelected, setEmptyProjectSelected] = useState(false);

  return (
    <>
      <DialogContent sx={{ px: { sm: '10%' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Typography fontWeight={600}>{t('project.form.here_you_can_create_project')}</Typography>
          <Divider />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: '1rem 2rem',
              alignItems: 'center',
            }}>
            <NfrProjectSearch
              onSelectProject={(project) => {
                setSelectedNfrProject(project);
                setEmptyProjectSelected(false);
              }}
            />
            <Typography>{t('project.form.start_with_nfr_project')}</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: '1rem 2rem',
              alignItems: 'center',
            }}>
            <Button
              sx={{
                width: 'fit-content',
                justifySelf: 'center',
                bgcolor: emptyProjectSelected ? 'primary.main' : 'background.default',
              }}
              variant={emptyProjectSelected ? 'contained' : 'outlined'}
              onClick={() => {
                setSelectedNfrProject(null);
                setEmptyProjectSelected(!emptyProjectSelected);
              }}>
              {t('project.form.empty_registration')}
            </Button>
            <Typography>{t('project.form.start_with_empty_form')}</Typography>
          </Box>
          <Divider />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          disabled={!emptyProjectSelected && !selectedNfrProject}
          onClick={() => {
            if (emptyProjectSelected) {
              setInitialValues(emptyProject);
            } else if (selectedNfrProject) {
              const projectFromNfr: SaveCristinProject = {
                ...emptyProject,
                title: getLanguageString(selectedNfrProject.labels),
                startDate: selectedNfrProject.activeFrom,
                endDate: selectedNfrProject.activeTo,
                // TODO: prefill project manager search with 'lead'?
              };
              setInitialValues(projectFromNfr);
            }
          }}>
          {t('common.start')}
        </Button>
      </DialogActions>
    </>
  );
};
