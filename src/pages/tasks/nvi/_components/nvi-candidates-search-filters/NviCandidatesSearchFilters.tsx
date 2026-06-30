import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NviCandidatesSearchParam } from '../../../../../api/searchApi';
import { AreaOfResponsibilitySelector } from '../../../../../components/filters/AreaOfResponsibiltySelector';
import { ExcludeSubunitsCheckbox } from '../../../../../components/filters/ExcludeSubunitsCheckbox';
import { NviYearSelector } from '../../../../../components/filters/nvi/NviYearSelector';
import { SearchForm } from '../../../../../components/filters/SearchForm';
import { useNviCandidatesParams } from '../../../../../utils/hooks/useNviCandidatesParams';
import { CoPublicationsCheckbox } from './_components/CoPublicationsCheckbox';
import { IncludeCandidatesWithoutCuratorCheckbox } from './_components/IncludeCandidatesWithoutCuratorCheckbox';
import { NviCandidatesCuratorSelector } from './_components/NviCandidatesCuratorSelector';
import { NviStatusFilter } from './_components/NviStatusFilter';

export const NviCandidatesSearchFilters = () => {
  const { t } = useTranslation();
  const nviParams = useNviCandidatesParams();

  return (
    <Grid container columns={16} spacing="1rem" sx={{ px: { xs: '0.5rem', md: 0 }, my: '1rem' }}>
      <Grid size={{ xs: 16, md: 4 }}>
        <NviStatusFilter />
      </Grid>
      <Grid size={{ xs: 16, md: 12, lg: 8 }}>
        <SearchForm
          placeholder={t('tasks.search_placeholder')}
          paginationOffsetParamName={NviCandidatesSearchParam.Offset}
        />
      </Grid>
      <Grid size={{ xs: 16, sm: 8, md: 4 }}>
        <CoPublicationsCheckbox />
      </Grid>
      <Grid size={{ xs: 16, sm: 8, md: 6, lg: 4 }}>
        <IncludeCandidatesWithoutCuratorCheckbox />
      </Grid>
      <Grid size={{ xs: 16, sm: 6, lg: 4 }}>
        <NviCandidatesCuratorSelector />
      </Grid>
      <Grid size={{ xs: 8, sm: 5, lg: 4 }}>
        <AreaOfResponsibilitySelector
          paramName={NviCandidatesSearchParam.Affiliations}
          resetPagination={(params) => {
            params.delete(NviCandidatesSearchParam.Offset);
            if (!params.has(NviCandidatesSearchParam.Affiliations)) {
              params.delete(NviCandidatesSearchParam.ExcludeSubUnits);
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 8, sm: 5, lg: 2 }}>
        <ExcludeSubunitsCheckbox
          paramName={NviCandidatesSearchParam.ExcludeSubUnits}
          paginationParamName={NviCandidatesSearchParam.Offset}
          disabled={!nviParams.affiliations?.length}
        />
      </Grid>
      <Grid size={{ xs: 16, md: 6, lg: 2 }}>
        <NviYearSelector fullWidth />
      </Grid>
    </Grid>
  );
};
