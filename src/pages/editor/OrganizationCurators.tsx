import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  IconButton,
  SxProps,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../api/commonApi';
import { fetchUsers } from '../../api/roleApi';
import { ListSkeleton } from '../../components/ListSkeleton';
import { OrganizationRenderOption } from '../../components/OrganizationRenderOption';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getAllChildOrganizations, getSortedSubUnits } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { rolesWithAreaOfResponsibility } from '../basic_data/institution_admin/edit_user/TasksFormSection';
import { UserFormDialog } from '../basic_data/institution_admin/edit_user/UserFormDialog';

import AddLinkIcon from '@mui/icons-material/AddLink';
import AdjustIcon from '@mui/icons-material/Adjust';
import EventIcon from '@mui/icons-material/Event';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SchoolIcon from '@mui/icons-material/School';
import TaskIcon from '@mui/icons-material/Task';

export const OrganizationCurators = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;
  const customerId = user?.customerId;

  const [searchId, setSearchId] = useState('');

  const organizationQuery = useQuery({
    queryKey: [organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => getById<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, rolesWithAreaOfResponsibility) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const allSubUnits = getSortedSubUnits(organizationQuery.data?.hasPart);

  return (
    <>
      <Helmet>
        <title>Oversikt over kuratorer</title>
      </Helmet>
      <Typography variant="h1" sx={{ mb: '1rem' }}>
        Oversikt over kuratorer
      </Typography>

      {organizationQuery.isLoading || curatorsQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Autocomplete
            data-testid={dataTestId.editor.organizationOverviewSearchField}
            options={allSubUnits}
            inputMode="search"
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={(props, option) => <OrganizationRenderOption key={option.id} props={props} option={option} />}
            filterOptions={(options, state) =>
              options.filter(
                (option) =>
                  Object.values(option.labels).some((label) =>
                    label.toLowerCase().includes(state.inputValue.toLowerCase())
                  ) || getIdentifierFromId(option.id).includes(state.inputValue)
              )
            }
            getOptionKey={(option) => option.id}
            onChange={(_, selectedUnit) => setSearchId(selectedUnit?.id ?? '')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('search.search_for_sub_unit')} />
            )}
          />

          {organizationQuery.data && (
            <OrganizationAccordion
              organization={organizationQuery.data}
              searchId={searchId}
              curators={curatorsQuery.data ?? []}
              refetchCurators={curatorsQuery.refetch}
            />
          )}
        </Box>
      )}
    </>
  );
};

interface OrganizationAccordionProps {
  organization: Organization;
  searchId: string;
  curators: InstitutionUser[];
  refetchCurators: () => void;
  includeAllSubunits?: boolean;
  level?: number;
}

const OrganizationAccordion = ({
  organization,
  searchId,
  curators,
  refetchCurators,
  level = 0,
  includeAllSubunits = false,
}: OrganizationAccordionProps) => {
  const { t } = useTranslation();

  const [expandedState, setExpandedState] = useState(level === 0);

  const isSearchedUnit = organization.id === searchId;

  if (!!searchId && !isSearchedUnit && !includeAllSubunits) {
    const allSubunits = getAllChildOrganizations(organization.hasPart);
    if (!allSubunits.some((subunit) => subunit.id === searchId)) {
      return null; // Hide this element if the searched ID is not a part of this unit
    }
  }
  const expanded = expandedState || (!!searchId && !includeAllSubunits);
  const subunitsCount = organization.hasPart?.length ?? 0;

  const curatorsOnThisUnit = curators.filter((curator) => curator.viewingScope.includedUnits.includes(organization.id));

  return (
    <Accordion
      data-testid={dataTestId.editor.organizationAccordion(organization.id)}
      elevation={2}
      disableGutters
      sx={{ bgcolor: level % 2 === 0 ? 'secondary.main' : 'secondary.light', ml: { xs: undefined, md: `${level}rem` } }}
      expanded={expanded}
      onChange={() => setExpandedState(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: '0.5rem 1rem',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr', lg: '2fr 1fr 1fr' },
            '& > p': { fontWeight: isSearchedUnit ? 700 : undefined },
          }}>
          <Typography>{getLanguageString(organization.labels)}</Typography>
          <Typography>{curatorsOnThisUnit.length} kuratorer</Typography>
          <Typography>{subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pr: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mb: '1rem' }}>
          {curatorsOnThisUnit.map((user) => (
            <CuratorRow curator={user} refetchCurators={refetchCurators} />
          ))}
        </Box>
        {expanded &&
          organization.hasPart?.map((subunit) => (
            <OrganizationAccordion
              key={subunit.id}
              organization={subunit}
              level={level + 1}
              searchId={searchId}
              includeAllSubunits={includeAllSubunits || isSearchedUnit}
              curators={curators}
              refetchCurators={refetchCurators}
            />
          ))}
      </AccordionDetails>
    </Accordion>
  );
};

interface CuratorRowProps {
  curator: InstitutionUser;
  refetchCurators: () => void;
}

const StyledUnselectedIcon = styled('span')(({ theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  border: 'solid 2px',
  borderColor: theme.palette.secondary.dark,
}));

const selectedIconStyling: SxProps = {
  p: '0.125rem',
  borderRadius: '50%',
};

const CuratorRow = ({ curator, refetchCurators }: CuratorRowProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => {
    if (openDialog) {
      refetchCurators();
    }
    setOpenDialog(!openDialog);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        p: '0.375rem 0.5rem',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Typography>
          {curator.givenName} {curator.familyName}
        </Typography>
        <IconButton title="Endre bruker" onClick={toggleDialog} size="small" sx={{ bgcolor: 'secondary.light' }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.SupportCurator) ? (
            <MarkEmailReadIcon sx={{ ...selectedIconStyling, bgcolor: 'generalSupportCase.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>Brukerstøtte</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.PublishingCurator) ? (
            <TaskIcon sx={{ ...selectedIconStyling, bgcolor: 'publishingRequest.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>Publisering</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.CuratorThesis) ? (
            <SchoolIcon sx={{ ...selectedIconStyling, bgcolor: 'publishingRequest.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>Studentoppgaver</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.CuratorThesisEmbargo) ? (
            <EventIcon sx={{ ...selectedIconStyling, bgcolor: 'publishingRequest.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>Embargo</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.DoiCurator) ? (
            <AddLinkIcon sx={{ ...selectedIconStyling, bgcolor: 'doiRequest.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>DOI</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {curator.roles.some((userRole) => userRole.rolename === RoleName.NviCurator) ? (
            <AdjustIcon sx={{ ...selectedIconStyling, bgcolor: 'nvi.main' }} />
          ) : (
            <StyledUnselectedIcon />
          )}
          <Typography>NVI</Typography>
        </Box>
      </Box>

      {curator.cristinId && (
        <UserFormDialog
          open={openDialog}
          onClose={toggleDialog}
          existingPerson={curator.cristinId}
          existingUser={curator}
        />
      )}
    </Box>
  );
};
