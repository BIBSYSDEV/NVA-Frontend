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
import { Ticket } from '../../types/publication_types/messages.types';
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

  const [selectedTypes, setSelectedTypes] = useState({
    doiRequest: true,
    generalSupportCase: true,
    publishingRequest: true,
  });

  const [institutionUser] = useFetch<InstitutionUser>({
    url: user?.nvaUsername ? `${RoleApiPath.Users}/${user.nvaUsername}` : '',
    errorMessage: t('feedback.error.get_roles'),
    withAuthentication: true,
  });

  const viewingScopes = institutionUser?.viewingScope?.includedUnits ?? [];
  const viewingScopeId = viewingScopes.length > 0 ? viewingScopes[0] : '';
  const [viewingScopeOrganization, isLoadingViewingScopeOrganization] = useFetchResource<Organization>(viewingScopeId);

  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([_, selected]) => selected)
    .map(([key]) => key);

  const typeQuery =
    selectedTypesArray.length > 0 ? `&query=(${selectedTypesArray.map((type) => 'type:' + type).join(' OR ')})` : '';

  const [ticketsSearch, isLoadingTicketsSearch] = useFetch<SearchResponse<Ticket>>({
    url: `${SearchApiPath.Tickets}?results=${rowsPerPage}&from=${page * rowsPerPage}${typeQuery}`,
    errorMessage: t('feedback.error.get_messages'),
    withAuthentication: true,
  });

  const tickets = ticketsSearch?.hits ?? [];
  const typeBuckets = ticketsSearch?.aggregations?.type.buckets ?? [];
  const doiRequestCount = typeBuckets.find((bucket) => bucket.key === 'DoiRequest')?.docCount ?? 0;
  const publishingRequestCount = typeBuckets.find((bucket) => bucket.key === 'PublishingRequest')?.docCount ?? 0;
  const generalSupportCaseCount = typeBuckets.find((bucket) => bucket.key === 'GeneralSupportCase')?.docCount ?? 0;

  return (
    <StyledPageWithSideMenu>
      <Helmet>
        <title>{t('common.tasks')}</title>
      </Helmet>
      <SidePanel>
        <SideNavHeader icon={AssignmentIcon} text={t('common.tasks')} />

        <Box component="article" sx={{ m: '1rem' }}>
          {viewingScopeId ? (
            isLoadingViewingScopeOrganization ? (
              <CircularProgress aria-label={t('common.tasks')} />
            ) : (
              viewingScopeOrganization && (
                <Typography sx={{ fontWeight: 700 }}>
                  {t('tasks.limited_to', {
                    name: getLanguageString(viewingScopeOrganization.name),
                  })}
                </Typography>
              )
            )
          ) : null}
        </Box>

        <Divider />

        <FormGroup sx={{ m: '1rem' }}>
          <FormControlLabel
            checked={selectedTypes.doiRequest}
            control={
              <Checkbox
                sx={{ py: '0.2rem' }}
                onChange={() => {
                  setSelectedTypes({ ...selectedTypes, doiRequest: !selectedTypes.doiRequest });
                }}
              />
            }
            label={
              selectedTypes.doiRequest
                ? `${t('my_page.messages.types.DoiRequest')} (${doiRequestCount})`
                : t('my_page.messages.types.DoiRequest')
            }
          />
          <FormControlLabel
            checked={selectedTypes.publishingRequest}
            control={
              <Checkbox
                sx={{ py: '0.2rem' }}
                onChange={() => {
                  setSelectedTypes({ ...selectedTypes, publishingRequest: !selectedTypes.publishingRequest });
                }}
              />
            }
            label={
              selectedTypes.publishingRequest
                ? `${t('my_page.messages.types.PublishingRequest')} (${publishingRequestCount})`
                : t('my_page.messages.types.PublishingRequest')
            }
          />
          <FormControlLabel
            checked={selectedTypes.generalSupportCase}
            control={
              <Checkbox
                sx={{ py: '0.2rem' }}
                onChange={() => {
                  setSelectedTypes({ ...selectedTypes, generalSupportCase: !selectedTypes.generalSupportCase });
                }}
              />
            }
            label={
              selectedTypes.generalSupportCase
                ? `${t('my_page.messages.types.GeneralSupportCase')} (${generalSupportCaseCount})`
                : t('my_page.messages.types.GeneralSupportCase')
            }
          />
        </FormGroup>
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
