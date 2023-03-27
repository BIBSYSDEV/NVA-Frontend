import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  TablePagination,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { RoleApiPath, SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { Ticket, TicketType } from '../../types/publication_types/messages.types';
import { ListSkeleton } from '../../components/ListSkeleton';
import { SearchResponse } from '../../types/common.types';
import { RootState } from '../../redux/store';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/organization.types';
import { getLanguageString } from '../../utils/translation-helpers';
import { TicketAccordionList } from './TicketAccordionList';
import { InstitutionUser } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { StyledPageWithSideMenu, SidePanel, SideNavHeader } from '../../components/PageWithSideMenu';

const rowsPerPageOptions = [10, 20, 50];

const TasksPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const [institutionUser] = useFetch<InstitutionUser>({
    url: user?.nvaUsername ? `${RoleApiPath.Users}/${user.nvaUsername}` : '',
    errorMessage: t('feedback.error.get_roles'),
    withAuthentication: true,
  });

  const viewingScopes = institutionUser?.viewingScope?.includedUnits ?? [];
  const viewingScopeId = viewingScopes.length > 0 ? viewingScopes[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  const [ticketsSearch, isLoadingTicketsSearch] = useFetch<SearchResponse<Ticket>>({
    url: `${SearchApiPath.Tickets}?results=${rowsPerPage}&from=${page * rowsPerPage}`,
    errorMessage: t('feedback.error.get_messages'),
    withAuthentication: true,
  });

  const tickets = ticketsSearch?.hits ?? [];

  return (
    <StyledPageWithSideMenu>
      <Helmet>
        <title>{t('common.tasks')}</title>
      </Helmet>
      <SidePanel>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />

        <Box sx={{ p: '1rem' }}>
          {viewingScopeId ? (
            isLoadingViewingScopeOrganization ? (
              <CircularProgress />
            ) : (
              viewingScopeOrganization && (
                <Typography paragraph sx={{ fontWeight: 700 }}>
                  {t('tasks.limited_to', {
                    name: getLanguageString(viewingScopeOrganization.name),
                  })}
                </Typography>
              )
            )
          ) : null}

          <Divider></Divider>
          <FormGroup>
            {ticketsSearch?.aggregations?.type.buckets.map((bucket) => {
              const ticketTypeString = t(`my_page.messages.types.${bucket.key as TicketType}`);
              const ticketTypeFacetText = `${ticketTypeString} (${bucket.docCount})`;
              return (
                <FormControlLabel
                  key={bucket.key}
                  disabled
                  checked
                  control={<Checkbox />}
                  label={ticketTypeFacetText}
                />
              );
            })}
          </FormGroup>
        </Box>
      </SidePanel>
      <section>
        {isLoadingTicketsSearch ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <TicketAccordionList tickets={tickets} />
            <TablePagination
              aria-live="polite"
              data-testid={dataTestId.startPage.searchPagination}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={ticketsSearch?.size ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
            />
          </>
        )}
      </section>
    </StyledPageWithSideMenu>
  );
};

export default TasksPage;
