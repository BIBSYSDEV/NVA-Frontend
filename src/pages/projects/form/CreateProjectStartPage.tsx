import { Autocomplete, Box, Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifiedFundingApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { SearchResponse } from '../../../types/common.types';
import { SaveCristinProject, NfrProject, emptyProject } from '../../../types/project.types';
import { getPeriodString } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';

interface CreateProjectStartPageProps {
  onClose: () => void;
  setInitialValues: (project: SaveCristinProject) => void;
}

export const CreateProjectStartPage = ({ onClose, setInitialValues }: CreateProjectStartPageProps) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useFetch<SearchResponse<NfrProject>>({
    url: debouncedSearchTerm ? `${VerifiedFundingApiPath.Nfr}?term=${debouncedSearchTerm}&size=20` : '',
    errorMessage: 'Kunne ikke hente NFR-prosjekt',
  });
  const projects = nfrProjectSearch?.hits ?? [];

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
            <Autocomplete
              options={projects}
              filterOptions={(options) => options}
              onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
              getOptionLabel={(option) => getLanguageString(option.labels)}
              renderOption={(props, option) => {
                const projectName = getLanguageString(option.labels);
                const period = getPeriodString(option.activeFrom, option.activeTo);
                const manager = option.lead ? `${t('project.project_manager')}: ${option.lead}` : '';
                return (
                  <li {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 600 }}>{projectName}</Typography>
                      <Typography variant="body1">{period}</Typography>
                      <Typography variant="body2">{manager}</Typography>
                    </Box>
                  </li>
                );
              }}
              onChange={(_, value) => {
                setSelectedNfrProject(value);
                setEmptyProjectSelected(false);
              }}
              loading={isLoadingNfrProjectSearch}
              renderInput={(params) => (
                <AutocompleteTextField
                  {...params}
                  label={t('registration.description.funding.nfr_project')}
                  isLoading={isLoadingNfrProjectSearch}
                  placeholder={t('registration.description.funding.nfr_project_search')}
                  showSearchIcon
                />
              )}
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
              sx={{ width: 'fit-content', justifySelf: 'center' }}
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
                // TODO: Reuse 'lead' for something?
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
