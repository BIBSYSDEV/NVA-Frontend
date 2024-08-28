import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { Autocomplete, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifiedFundingApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { SearchResponse } from '../../../types/common.types';
import { NfrProject, ProjectOrganization, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';
import { CreateProjectAccordion } from './CreateProjectAccordion';
import { NFRProjectOption } from './NRFProjectOption';

interface NFRProjectProps {
  newProject: SaveCristinProject;
  setNewProject: (val: SaveCristinProject) => void;
  setShowProjectForm: (val: boolean) => void;
  coordinatingInstitution: ProjectOrganization;
}

export const NFRProject = ({
  newProject,
  setNewProject,
  setShowProjectForm,
  coordinatingInstitution,
}: NFRProjectProps) => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<NfrProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useFetch<SearchResponse<NfrProject>>({
    url: debouncedSearchTerm ? `${VerifiedFundingApiPath.Nfr}?term=${debouncedSearchTerm}&size=20` : '',
    errorMessage: t('feedback.error.search'),
  });
  const nfrProjects = nfrProjectSearch?.hits ?? [];

  const onCreateProject = () => {
    if (!selectedProject) {
      return;
    }
    setNewProject({
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
    });
    setShowProjectForm(true);
  };

  return (
    <CreateProjectAccordion
      headline={t('project.form.start_with_nfr_financing')}
      description={t('project.form.start_with_nfr_financing_details')}
      testId={dataTestId.newProjectPage.createNFRProjectAccordion}
      icon={<PaidOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Autocomplete
          data-testid={dataTestId.newProjectPage.nrfProjectSearchInput}
          options={nfrProjects}
          getOptionLabel={(option) => option.labels.nb || ''}
          onInputChange={(_, newInputValue, reason) => {
            if (reason !== 'reset') {
              // Autocomplete triggers "reset" events after input change when it's controlled. Ignore these.
              setSearchTerm(newInputValue);
            }
          }}
          inputValue={searchTerm}
          onChange={(_, value: NfrProject | null) => {
            if (value?.id) {
              setSearchTerm('');
              setSelectedProject(value);
            }
          }}
          popupIcon={null}
          clearIcon={null}
          value={null}
          loading={isLoadingNfrProjectSearch}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={t('project.new_project.nfr_project')}
              isLoading={isLoadingNfrProjectSearch}
              placeholder={t('project.new_project.search_for_project_name_or_placeholder')}
              showSearchIcon={debouncedSearchTerm.length === 0}
            />
          )}
          renderOption={({ key, ...props }, option: NfrProject) => (
            <li {...props} key={option.identifier}>
              <NFRProjectOption project={option} />
            </li>
          )}
        />
        {selectedProject && (
          <>
            <Typography sx={{ fontWeight: 'bold', mt: '1rem' }}>{t('common.project')}</Typography>
            <Typography>{getLanguageString(selectedProject.labels)}</Typography>
          </>
        )}
        <Button
          variant="contained"
          sx={{ width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          disabled={!selectedProject}
          onClick={onCreateProject}
          data-testid={dataTestId.newProjectPage.startNfrProjectButton}>
          <>
            {t('project.form.start_registering_project')}
            <EastOutlinedIcon sx={{ width: '1rem', ml: '0.5rem' }} />
          </>
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};
