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

export interface OrganizationCuratorsAccordionProps extends Pick<OrganizationCuratorsProps, 'canEditUsers'> {
  organization: Organization;
  unitSearch?: string;
  curatorSearch?: string;
  curators: InstitutionUser[];
  refetchCurators: () => Promise<unknown>;
  parentOrganizationIds: string[];
  includeAllSubunits?: boolean;
}

export const OrganizationCuratorsAccordion = ({
  organization,
  unitSearch,
  curatorSearch,
  curators,
  refetchCurators,
  canEditUsers,
  parentOrganizationIds,
  includeAllSubunits = false,
}: OrganizationCuratorsAccordionProps) => {
  const { t } = useTranslation();
  const level = parentOrganizationIds.length;

  const [openAddCuratorDialog, setOpenAddCuratorDialog] = useState(false);
  const [expandedState, setExpandedState] = useState(level === 0);

  const isSearchedUnit = organization.id === unitSearch;

  // Avoid rendering organizations that are not part of the search results
  if (!!unitSearch && !isSearchedUnit && !includeAllSubunits) {
    const allSubunits = getAllChildOrganizations(organization.hasPart);
    if (!allSubunits.some((subunit) => subunit.id === unitSearch)) {
      return null;
    }
  }
  if (curatorSearch) {
    const searchedCurator = curators.filter((curator) => curator.username === curatorSearch);
    if (searchedCurator.length === 1) {
      const allSubunits = getAllChildOrganizations([organization]).map((subunit) => subunit.id);
      const overlappingOrg = allSubunits.some((subunit) =>
        searchedCurator[0].viewingScope.includedUnits.includes(subunit)
      );
      if (!overlappingOrg) {
        return null;
      }
    }
  }

  const curatorsOnThisUnit = curators.filter((curator) => curator.viewingScope.includedUnits.includes(organization.id));
  const searchedCurators = curatorSearch
    ? curatorsOnThisUnit.filter((curator) => curator.username === curatorSearch)
    : curatorsOnThisUnit;

  const expanded = expandedState || (!!unitSearch && !includeAllSubunits) || !!curatorSearch;
  const subunitsCount = organization.hasPart?.length ?? 0;

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
          {searchedCurators.map((user) => (
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
            data-testid={dataTestId.editor.addCuratorButton(organization.id)}
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
          refetchCurators={refetchCurators}
          parentOrganizationIds={parentOrganizationIds}
        />

        {expanded &&
          organization.hasPart?.map((subunit) => (
            <OrganizationCuratorsAccordion
              key={subunit.id}
              organization={subunit}
              unitSearch={unitSearch}
              curatorSearch={curatorSearch}
              includeAllSubunits={includeAllSubunits || isSearchedUnit}
              curators={curators}
              refetchCurators={refetchCurators}
              canEditUsers={canEditUsers}
              parentOrganizationIds={[...parentOrganizationIds, organization.id]}
            />
          ))}
      </AccordionDetails>
    </Accordion>
  );
};
