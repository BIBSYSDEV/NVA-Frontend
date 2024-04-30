import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../../api/cristinApi';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationScopeItem } from './OrganizationScopeItem';

export interface OrganizationScopeProps {
  organizationScope: string[];
  setOrganizationScope: Dispatch<SetStateAction<string[]>>;
  excludeSubunits: boolean;
  setExcludeSubunits: Dispatch<SetStateAction<boolean>>;
  hide?: boolean;
}

export const OrganizationScope = ({
  organizationScope,
  setOrganizationScope,
  excludeSubunits,
  setExcludeSubunits,
  hide = false,
}: OrganizationScopeProps) => {
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
    gcTime: 1_800_000,
  });

  const organizationOptions = organizationQuery.data
    ? getSortedSubUnits([organizationQuery.data]).filter((organization) => !organizationScope.includes(organization.id))
    : [];

  return (
    <Box
      component="article"
      sx={{ m: '1rem', display: hide ? 'none' : 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {organizationScope.map((organizationScopeId) => (
        <OrganizationScopeItem
          key={organizationScopeId}
          organizationScopeId={organizationScopeId}
          setOrganizationScope={setOrganizationScope}
          hideRemoveButton={organizationScope.length === 1}
        />
      ))}
      <FormControlLabel
        onChange={() => setExcludeSubunits((state) => !state)}
        control={<Checkbox checked={excludeSubunits} />}
        label={t('tasks.nvi.exclude_subunits')}
      />
      <Button
        data-testid={dataTestId.tasksPage.scope.addOrganizationScopeButton}
        sx={{ width: 'fit-content', alignSelf: 'center' }}
        onClick={toggleDialog}
        size="small">
        {t('tasks.select_other_unit_filter')}
      </Button>

      <Dialog open={showOrganizationsDialog} onClose={toggleDialog} fullWidth>
        <DialogTitle>{getLanguageString(organizationQuery.data?.labels)}</DialogTitle>
        <DialogContent>
          <Autocomplete
            data-testid={dataTestId.tasksPage.scope.organizationSearchField}
            options={organizationOptions}
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {getLanguageString(option.labels)}
              </li>
            )}
            onChange={(_, value) => {
              if (value?.id) {
                setOrganizationScope((state) => [...state, value.id]);
                toggleDialog();
              }
            }}
            disabled={organizationQuery.isPending}
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
