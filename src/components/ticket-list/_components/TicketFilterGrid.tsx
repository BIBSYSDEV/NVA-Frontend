import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TicketSearchParam } from '../../../api/searchApi';
import { ExcludeSubunitsCheckbox } from '../../../pages/messages/components/ExcludeSubunitsCheckbox';
import { TicketDateIntervalFilter } from '../../../pages/messages/components/TicketDateIntervalFilter';
import { RootState } from '../../../redux/store';
import { TicketStatus } from '../../../types/publication_types/ticket.types';
import { AreaOfResponsibilitySelector } from '../../AreaOfResponsibiltySelector';
import { CategorySearchFilter } from '../../CategorySearchFilter';
import { DialoguesWithoutCuratorButton } from '../../DialoguesWithoutCuratorButton';
import { SearchForm } from '../../SearchForm';
import { DisplayOptionsDropdown } from './DisplayOptionsDropdown';
import { TicketCuratorSelector } from './TicketCuratorSelector';
import { TicketStatusFilter } from './TicketStatusFilter';

interface TicketFilterGridProps {
  ticketStatusOptions: TicketStatus[];
  showAdvancedFilters?: boolean;
}

export const TicketFilterGrid = ({ showAdvancedFilters = false, ticketStatusOptions }: TicketFilterGridProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const searchParams = new URLSearchParams(location.search);

  return (
    <Grid container columns={16} spacing={2} sx={{ px: { xs: '0.5rem', md: 0 }, mb: '1rem' }}>
      <Grid size={{ xs: 16, md: 5, lg: 4 }}>
        <TicketStatusFilter options={ticketStatusOptions} />
      </Grid>
      <Grid size={{ xs: 16, md: 11, lg: 9 }}>
        <SearchForm placeholder={t('tasks.search_placeholder')} paginationOffsetParamName={TicketSearchParam.From} />
      </Grid>
      {user && (
        <Grid size={{ xs: 16, md: 5, lg: 3 }}>
          <DisplayOptionsDropdown user={user} />
        </Grid>
      )}
      {showAdvancedFilters && (
        <>
          <Grid size={{ xs: 16, sm: 8, md: 6, lg: 4 }}>
            <DialoguesWithoutCuratorButton />
          </Grid>
          <Grid size={{ xs: 16, sm: 8, md: 5, lg: 4 }}>
            <TicketCuratorSelector />
          </Grid>
          <Grid size={{ xs: 8, lg: 5 }}>
            <AreaOfResponsibilitySelector
              paramName={TicketSearchParam.OrganizationId}
              resetPagination={(params) => {
                params.delete(TicketSearchParam.From);
              }}
            />
          </Grid>
          <Grid size={{ xs: 8, lg: 3 }}>
            <ExcludeSubunitsCheckbox
              paramName={TicketSearchParam.ExcludeSubUnits}
              paginationParamName={TicketSearchParam.From}
              disabled={!searchParams.has(TicketSearchParam.OrganizationId)}
            />
          </Grid>
        </>
      )}
      <Grid>
        <TicketDateIntervalFilter />
      </Grid>
      <Grid>
        <CategorySearchFilter searchParam={TicketSearchParam.PublicationType} hideHeading />
      </Grid>
    </Grid>
  );
};
