import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../types/organization.types';
import { dataTestId } from '../utils/dataTestIds';
import { getIdentifierFromId } from '../utils/general-helpers';
import { getAllChildOrganizations } from '../utils/institutions-helpers';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationAccordionProps {
  organization: Organization;
  searchId: string;
  selectedId: string;
  setSelectedOrganization: (organization: Organization) => void;
  level?: number;
  includeAllSubunits?: boolean;
  displayOrgId?: boolean;
  displaySubunitsCount?: boolean;
}

export const OrganizationAccordion = ({
  organization,
  searchId,
  selectedId,
  setSelectedOrganization,
  level = 0,
  includeAllSubunits = false,
  displayOrgId = false,
  displaySubunitsCount = false,
}: OrganizationAccordionProps) => {
  const { t } = useTranslation();

  const foundBySearch = organization.id === searchId;
  const foundBySelect = organization.id === selectedId;

  const allSubunits = getAllChildOrganizations(organization.hasPart);

  // Starts as expanded if the organization or one of its children are selected manually
  const [isExpanded, setIsExpanded] = useState(
    foundBySelect || allSubunits.some((subunit) => subunit.id === selectedId)
  );

  // Hide this element if the searched ID is not a part of this unit
  if (!!searchId && !foundBySearch && !includeAllSubunits && !allSubunits.some((subunit) => subunit.id === searchId)) {
    return null;
  }

  let expanded = isExpanded || (!!searchId && !includeAllSubunits);

  // Close all expanded when searches are reset
  if (!searchId && !selectedId) {
    expanded = false;
  }

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
      onChange={() => {
        setIsExpanded(!expanded);
        setSelectedOrganization(organization);
      }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ visibility: subunitsCount > 0 ? null : 'hidden' }} />}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: '0.25rem 1rem',
            gridTemplateColumns: {
              xs: 'auto 1fr',
              lg: 'auto 3fr 3fr 1fr 1fr',
              alignItems: 'center',
            },
            py: '0.25rem',
            '& > p': { fontWeight: foundBySearch ? 700 : undefined },
          }}>
          {foundBySelect ? <RadioButtonCheckedIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography sx={{ gridColumn: { xs: '1/3', lg: '3/4' } }}>{organization.labels['en']}</Typography>
          {displayOrgId && (
            <Typography sx={{ gridColumn: { xs: '1/3', lg: '4/5' } }}>
              {getIdentifierFromId(organization.id)}
            </Typography>
          )}
          {displaySubunitsCount && (
            <Typography sx={{ gridColumn: { xs: '1/3', lg: '5/6' } }}>
              {subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      {subunitsCount > 0 && (
        <AccordionDetails sx={{ pr: 0 }}>
          {expanded &&
            organization.hasPart?.map((subunit) => (
              <OrganizationAccordion
                key={subunit.id}
                organization={subunit}
                level={level + 1}
                searchId={searchId}
                includeAllSubunits={includeAllSubunits || foundBySearch}
                selectedId={selectedId}
                setSelectedOrganization={setSelectedOrganization}
                displayOrgId={displayOrgId}
                displaySubunitsCount={displaySubunitsCount}
              />
            ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
};
