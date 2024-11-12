import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { OrganizationAccordion } from '../../../components/OrganizationAccordion';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface OrganizationHierarchyFilterProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  organization: Organization;
}

export const OrganizationHierarchyFilter = ({ organization, open, onClose }: OrganizationHierarchyFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const unitFromParams = params.get(ResultParam.Unit) ?? '';

  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState(unitFromParams);

  useEffect(() => {
    // Reset selection state when URL is updated elsewhere
    if (!unitFromParams) {
      setSelectedId('');
    }
  }, [unitFromParams]);

  const closeDialog = () => {
    onClose();
    setSearchId('');
  };

  const allSubUnits = getSortedSubUnits(organization.hasPart);

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
        setSelectedId(unitFromParams);
      }}
      maxWidth="lg"
      transitionDuration={0}>
      <DialogTitle>{t('common.select_unit')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: '2rem' }}>
          <Trans t={t} i18nKey="editor.institution.institution_helper_text">
            <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
          </Trans>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Autocomplete
            data-testid={dataTestId.editor.organizationOverviewSearchField}
            options={allSubUnits}
            inputMode="search"
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={({ key, ...props }, option) => (
              <OrganizationRenderOption key={option.id} props={props} option={option} />
            )}
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

          {organization.hasPart?.map((org) => (
            <OrganizationAccordion
              key={org.id}
              organization={org}
              searchId={searchId}
              selectedId={selectedId}
              setSelectedOrganization={(org) => setSelectedId(org.id)}
              displayOrgId
              displaySubunitsCount
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            closeDialog();
            setSelectedId(unitFromParams);
          }}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          disabled={!selectedId}
          onClick={() => {
            params.delete(ResultParam.From);
            params.set(ResultParam.Unit, selectedId);
            history.push({ search: params.toString() });
            closeDialog();
          }}>
          {t('common.select')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
