import {
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
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../../api/searchApi';
import { Organization } from '../../../../types/organization.types';
import { getSortedSubUnits } from '../../../../utils/institutions-helpers';
import { OrganizationAccordion } from '../../../OrganizationAccordion';
import { OrganizationSearchAutocomplete } from '../../../OrganizationSearchAutocomplete';
import { VerticalBox } from '../../../styled/Wrappers';

interface OrganizationHierarchyFilterProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  organization: Organization;
}

export const OrganizationHierarchyFilter = ({ organization, open, onClose }: OrganizationHierarchyFilterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
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

        <VerticalBox sx={{ gap: '0.5rem' }}>
          <OrganizationSearchAutocomplete
            options={allSubUnits}
            inputMode="search"
            onChange={(_, selectedUnit) => setSearchId(selectedUnit?.id ?? '')}
            renderInput={(params) => <TextField {...params} variant="outlined" label={t('common.select_unit')} />}
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
        </VerticalBox>
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
          color="secondary"
          disabled={!selectedId}
          onClick={() => {
            params.delete(ResultParam.From);
            params.set(ResultParam.Unit, selectedId);
            navigate({ search: params.toString() });
            closeDialog();
          }}>
          {t('common.select')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
