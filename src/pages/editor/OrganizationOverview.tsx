import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchResource } from '../../api/commonApi';
import { ListSkeleton } from '../../components/ListSkeleton';
import { OrganizationRenderOption } from '../../components/OrganizationRenderOption';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getAllChildOrganizations, getSortedSubUnits } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const OrganizationOverview = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;

  const [searchId, setSearchId] = useState('');

  const organizationQuery = useQuery({
    queryKey: ['organization', organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => fetchResource<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const allSubUnits = getSortedSubUnits(organizationQuery.data?.hasPart);

  return (
    <>
      <Helmet>
        <title>{t('editor.organization_overview')}</title>
      </Helmet>
      <Typography variant="h1" sx={{ mb: '1rem' }}>
        {t('editor.organization_overview')}
      </Typography>

      <Typography sx={{ mb: '2rem' }}>
        <Trans t={t} i18nKey="editor.institution.institution_helper_text">
          <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
        </Trans>
      </Typography>

      {organizationQuery.isLoading ? (
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

          {organizationQuery.data?.hasPart?.map((organization) => (
            <OrganizationAccordion key={organization.id} organization={organization} searchId={searchId} />
          ))}
        </Box>
      )}
    </>
  );
};

interface OrganizationAccordionProps {
  organization: Organization;
  searchId: string;
  includeAllSubunits?: boolean;
  level?: number;
}

const OrganizationAccordion = ({
  organization,
  searchId,
  level = 0,
  includeAllSubunits = false,
}: OrganizationAccordionProps) => {
  const { t } = useTranslation();

  const [expandedState, setExpandedState] = useState(false);

  const isSearchedUnit = organization.id === searchId;

  if (!!searchId && !isSearchedUnit && !includeAllSubunits) {
    const allSubunits = getAllChildOrganizations(organization.hasPart);
    if (!allSubunits.some((subunit) => subunit.id === searchId)) {
      return null; // Hide this element if the searched ID is not a part of this unit
    }
  }
  const expanded = expandedState || (!!searchId && !includeAllSubunits);
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
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ visibility: subunitsCount > 0 ? null : 'hidden' }} />}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: '0.5rem 1rem',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr', lg: '3fr 3fr 1fr 1fr' },
            '& > p': { fontWeight: isSearchedUnit ? 700 : undefined },
          }}>
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography>{organization.labels['en']}</Typography>
          <Typography>{getIdentifierFromId(organization.id)}</Typography>
          <Typography>{subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}</Typography>
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
                includeAllSubunits={includeAllSubunits || isSearchedUnit}
              />
            ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
};
