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
import { Organization } from '../../../../types/organization.types';
import { getSortedSubUnits } from '../../../../utils/institutions-helpers';
import { OrganizationAccordion } from '../../../OrganizationAccordion';
import { OrganizationSearchAutocomplete } from '../../../OrganizationSearchAutocomplete';
import { VerticalBox } from '../../../styled/Wrappers';

interface OrganizationHierarchyFilterProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  organization: Organization;
  value: string | null;
  onChange: (unitId: string) => void;
}

/**
 * Dialog for picking a sub-unit within `organization`'s hierarchy, either by searching or by expanding the
 * accordion tree. Pure controlled component: the currently selected unit id comes in as `value`, and picking one
 * calls `onChange` with the new id - it has no knowledge of the URL.
 */
export const OrganizationHierarchyFilter = ({
  organization,
  open,
  onClose,
  value,
  onChange,
}: OrganizationHierarchyFilterProps) => {
  const { t } = useTranslation();

  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState(value ?? '');

  useEffect(() => {
    // Keep selection in sync if value changes while the dialog is open, e.g. via browser back/forward navigation
    setSelectedId(value ?? '');
  }, [value]);

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
        setSelectedId(value ?? '');
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
            setSelectedId(value ?? '');
          }}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!selectedId}
          onClick={() => {
            onChange(selectedId);
            closeDialog();
          }}>
          {t('common.select')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
