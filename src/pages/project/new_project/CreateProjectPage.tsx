import { Box, Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../../api/cristinApi';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';
import { RootState } from '../../../redux/store';
import { emptyProject, NfrProject, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { InitialProjectFormData } from '../../projects/form/ProjectFormDialog';

interface CreateProjectStartPageProps {
  onClose: () => void;
  setInitialValues: (projectFormData: InitialProjectFormData) => void;
}

export const CreateProjectPage = ({ onClose, setInitialValues }: CreateProjectStartPageProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';

  const currentInstitutionQuery = useQuery({
    enabled: !!topOrgCristinId,
    queryKey: [topOrgCristinId],
    queryFn: () => fetchOrganization(topOrgCristinId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

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
              data-testid={dataTestId.registrationWizard.description.projectForm.startWithEmptyProjectButton}
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
          data-testid={dataTestId.registrationWizard.description.projectForm.startCreateProjectButton}
          variant="contained"
          disabled={currentInstitutionQuery.isPending || (!emptyProjectSelected && !selectedNfrProject)}
          onClick={() => {
            const coordinatingInstitution = currentInstitutionQuery.data ?? emptyProject.coordinatingInstitution;
            if (emptyProjectSelected) {
              setInitialValues({ project: { ...emptyProject, coordinatingInstitution } });
            } else if (selectedNfrProject) {
              const projectFromNfr: SaveCristinProject = {
                ...emptyProject,
                coordinatingInstitution,
                title: getLanguageString(selectedNfrProject.labels),
                startDate: selectedNfrProject.activeFrom,
                endDate: selectedNfrProject.activeTo,
                funding: [
                  {
                    type: 'UnconfirmedFunding',
                    source: selectedNfrProject.source,
                    identifier: selectedNfrProject.identifier,
                    labels: selectedNfrProject.labels,
                  },
                ],
              };

              setInitialValues({ project: projectFromNfr, suggestedProjectManager: selectedNfrProject.lead });
            }
          }}>
          {t('common.start')}
        </Button>
      </DialogActions>
    </>
  );
};
