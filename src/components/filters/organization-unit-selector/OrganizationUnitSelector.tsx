import { Box, Chip, Skeleton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationHierarchyFilter } from './components/OrganizationHierarchyFilter';

interface OrganizationUnitSelectorProps {
  parentOrganization: Organization | null;
  value: string | null;
  onChange: (unitId: string | null) => void;
}

/**
 * A chip that shows the currently selected sub-unit of `parentOrganization` (or a placeholder), and opens a dialog
 * ({@link OrganizationHierarchyFilter}) for picking a different one when clicked.
 *
 * Pure controlled component: the selected unit id comes in as `value`, and changes are reported via `onChange`
 * (called with `null` when the selection is cleared via the chip's delete icon).
 */
export const OrganizationUnitSelector = ({ parentOrganization, value, onChange }: OrganizationUnitSelectorProps) => {
  const { t } = useTranslation();
  const [showUnitSelection, setShowUnitSelection] = useState(false);

  const unitQuery = useFetchOrganization(value);

  const toggleShowUnitSelection = () => setShowUnitSelection(!showUnitSelection);

  return (
    <>
      <Chip
        data-testid={dataTestId.organization.subSearchField}
        color="tertiary"
        variant="filled"
        onClick={toggleShowUnitSelection}
        label={
          value ? (
            unitQuery.isPending ? (
              <Skeleton sx={{ minWidth: '10rem' }} />
            ) : (
              getLanguageString(unitQuery.data?.labels)
            )
          ) : (
            <Box component="span" sx={{ textWrap: 'nowrap' }}>
              {t('common.select_unit')}
            </Box>
          )
        }
        onDelete={value ? () => onChange(null) : undefined}
        sx={{ minWidth: value ? '15rem' : undefined }}
        disabled={!parentOrganization?.hasPart || parentOrganization?.hasPart?.length === 0}
      />

      {parentOrganization && (
        <OrganizationHierarchyFilter
          organization={parentOrganization}
          open={showUnitSelection}
          onClose={toggleShowUnitSelection}
          value={value}
          onChange={onChange}
        />
      )}
    </>
  );
};
