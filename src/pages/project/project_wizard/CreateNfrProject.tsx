import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NfrProject, ProjectOrganization, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { createNamesFromInput } from '../helpers/projectContributorHelpers';
import { CreateProjectAccordion } from './CreateProjectAccordion';
import { NfrProjectSearch } from './NfrProjectSearch';

interface NFRProjectProps {
  newProject: SaveCristinProject;
  setNewProject: (val: SaveCristinProject) => void;
  setShowProjectForm: (val: boolean) => void;
  setSuggestedProjectManager: (val: string) => void;
  coordinatingInstitution: ProjectOrganization;
}

export const CreateNfrProject = ({
  newProject,
  setNewProject,
  setShowProjectForm,
  setSuggestedProjectManager,
  coordinatingInstitution,
}: NFRProjectProps) => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<NfrProject | null>(null);

  const onCreateProject = () => {
    if (!selectedProject) {
      return;
    }

    setSuggestedProjectManager(selectedProject.lead);

    const newNFRProject: SaveCristinProject = {
      ...newProject,
      title: getLanguageString(selectedProject.labels),
      startDate: selectedProject.activeFrom,
      endDate: selectedProject.activeTo,
      coordinatingInstitution,
      funding: [
        {
          type: 'UnconfirmedFunding',
          source: selectedProject.source,
          identifier: selectedProject.identifier,
          labels: selectedProject.labels,
        },
      ],
    };

    if (selectedProject.lead) {
      const suggestedProjectManagerNames = createNamesFromInput(selectedProject.lead);
      newNFRProject.contributors = [
        {
          identity: {
            type: 'Person',
            firstName: suggestedProjectManagerNames.firstName,
            lastName: suggestedProjectManagerNames.lastName,
          },
          roles: [
            {
              type: 'ProjectManager',
              affiliation: undefined,
            },
          ],
        },
      ];
    }

    setNewProject(newNFRProject);
    setShowProjectForm(true);
  };

  return (
    <CreateProjectAccordion
      headline={t('project.form.start_with_nfr_financing')}
      description={t('project.form.start_with_nfr_financing_details')}
      testId={dataTestId.newProjectPage.createNFRProjectAccordion}
      icon={<PaidOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <NfrProjectSearch selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        <Button
          variant="contained"
          sx={{ width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          disabled={!selectedProject}
          onClick={onCreateProject}
          endIcon={<EastOutlinedIcon />}
          data-testid={dataTestId.newProjectPage.startNfrProjectButton}>
          {t('project.form.start_registering_project')}
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};
