import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../../../types/organization.types';
import { InstitutionUser } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getAllChildOrganizations } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { AddCuratorDialog } from './AddCuratorDialog';
import { OrganizationCuratorRow } from './OrganizationCuratorRow';
import { OrganizationCuratorsProps } from './OrganizationCurators';

interface OrganizationCuratorsAccordionProps extends Pick<OrganizationCuratorsProps, 'canEditUsers'> {
  organization: Organization;
  searchId: string;
  curators: InstitutionUser[];
  refetchCurators: () => void;
  includeAllSubunits?: boolean;
  level?: number;
}

export const OrganizationCuratorsAccordion = ({
  organization,
  searchId,
  curators,
  refetchCurators,
  canEditUsers,
  level = 0,
  includeAllSubunits = false,
}: OrganizationCuratorsAccordionProps) => {
  const { t } = useTranslation();

  const [openAddCuratorDialog, setOpenAddCuratorDialog] = useState(false);
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
      sx={{
        bgcolor: level % 2 === 0 ? 'secondary.main' : 'secondary.light',
        ml: { xs: undefined, md: level > 0 ? '1rem' : 0 },
      }}
      expanded={expanded}
      onChange={() => setExpandedState(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: '0.5rem 1rem',
            gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
            '& > p': { fontWeight: isSearchedUnit ? 700 : undefined },
          }}>
          <Typography>{getLanguageString(organization.labels)}</Typography>
          <Typography>{t('editor.curators.curators_count', { count: curatorsOnThisUnit.length })}</Typography>
          <Typography>{subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}</Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pr: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mb: '1rem' }}>
          {curatorsOnThisUnit.map((user) => (
            <OrganizationCuratorRow
              key={user.username}
              curator={user}
              refetchCurators={refetchCurators}
              canEditUsers={canEditUsers}
            />
          ))}
        </Box>

        {canEditUsers && (
          <Button
            variant="contained"
            sx={{ mb: '1rem' }}
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => setOpenAddCuratorDialog(true)}>
            {t('editor.curators.add_curator')}
          </Button>
        )}
        <AddCuratorDialog
          open={openAddCuratorDialog}
          onClose={() => setOpenAddCuratorDialog(false)}
          currentOrganization={organization}
        />

        {expanded &&
          organization.hasPart?.map((subunit) => (
            <OrganizationCuratorsAccordion
              key={subunit.id}
              organization={subunit}
              level={level + 1}
              searchId={searchId}
              includeAllSubunits={includeAllSubunits || isSearchedUnit}
              curators={curators}
              refetchCurators={refetchCurators}
              canEditUsers={canEditUsers}
            />
          ))}
      </AccordionDetails>
    </Accordion>
  );
};
