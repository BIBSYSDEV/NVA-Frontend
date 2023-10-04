import CancelIcon from '@mui/icons-material/Cancel';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../../api/cristinApi';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { RootState } from '../../../redux/store';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface ViewingScopeFilterProps {
  viewingScopeIds: string[];
  setOrganizationFilter: Dispatch<SetStateAction<string[]>>;
}

export const ViewingScopeFilter = ({ viewingScopeIds, setOrganizationFilter }: ViewingScopeFilterProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';

  const [showOrganizationsDialog, setShowOrganizationsDialog] = useState(false);
  const toggleDialog = () => setShowOrganizationsDialog(!showOrganizationsDialog);

  const organizationQuery = useQuery({
    enabled: !!topOrgCristinId,
    queryKey: [topOrgCristinId],
    queryFn: () => fetchOrganization(topOrgCristinId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000,
  });

  const organizationOptions = organizationQuery.data
    ? getSortedSubUnits([organizationQuery.data]).filter((organization) => !viewingScopeIds.includes(organization.id))
    : [];

  return (
    <Box component="article" sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {viewingScopeIds.map((viewingScopeId) => (
        <ViewingScopeItem
          key={viewingScopeId}
          viewingScopeId={viewingScopeId}
          setOrganizationFilter={setOrganizationFilter}
        />
      ))}
      <BetaFunctionality>
        <Button sx={{ width: 'fit-content', alignSelf: 'center' }} onClick={toggleDialog} size="small">
          {t('tasks.select_other_unit_filter')}
        </Button>
      </BetaFunctionality>

      <Dialog open={showOrganizationsDialog} onClose={toggleDialog} fullWidth>
        <DialogTitle>{getLanguageString(organizationQuery.data?.labels)}</DialogTitle>
        <DialogContent>
          <Autocomplete
            // data-testid={dataTestId.myInstitutionUsersPage.areaOfResponsibilityField}
            options={organizationOptions}
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {getLanguageString(option.labels)}
              </li>
            )}
            onChange={(_, value) => {
              if (value?.id) {
                setOrganizationFilter([...viewingScopeIds, value.id]);
                toggleDialog();
              }
            }}
            disabled={organizationQuery.isLoading}
            sx={{ mt: '1rem' }}
            renderInput={(params) => <TextField {...params} label={t('common.search')} />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

interface ViewingScopeItemProps extends Pick<ViewingScopeFilterProps, 'setOrganizationFilter'> {
  viewingScopeId: string;
}

const ViewingScopeItem = ({ viewingScopeId, setOrganizationFilter }: ViewingScopeItemProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    enabled: !!viewingScopeId,
    queryKey: [viewingScopeId],
    queryFn: () => fetchOrganization(viewingScopeId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000,
  });

  return (
    <Paper sx={{ p: '0.75rem', bgcolor: 'white' }} elevation={0}>
      {organizationQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Typography sx={{ fontWeight: 700 }}>{getLanguageString(organizationQuery.data?.labels)}</Typography>
      )}
      <IconButton
        size="small"
        color="primary"
        onClick={() => setOrganizationFilter((state) => state.filter((id) => id !== viewingScopeId))}>
        <CancelIcon />
      </IconButton>
    </Paper>
  );
};
