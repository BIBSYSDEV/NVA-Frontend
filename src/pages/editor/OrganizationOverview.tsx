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
import { getById } from '../../api/commonApi';
import { ListSkeleton } from '../../components/ListSkeleton';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getAllChildOrganizations, getSortedSubUnits } from '../../utils/institutions-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const OrganizationOverview = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;

  const [searchId, setSearchId] = useState('');

  const organizationQuery = useQuery({
    queryKey: [organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => getById<Organization>(organizationId) : undefined,
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
            options={allSubUnits}
            inputMode="search"
            getOptionLabel={(option) => getLanguageString(option.labels)}
            getOptionKey={(option) => option.id}
            onChange={(_, selectedUnit) => setSearchId(selectedUnit?.id ?? '')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('search.search_for_sub_unit')} />
            )}
          />

          {organizationQuery.data?.hasPart?.map((organization) => (
            <OrganizationLevel key={organization.id} organization={organization} searchId={searchId} />
          ))}
        </Box>
      )}
    </>
  );
};

interface OrganizationLevelProps {
  organization: Organization;
  searchId: string;
  level?: number;
}

const OrganizationLevel = ({ organization, searchId, level = 0 }: OrganizationLevelProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!!searchId && organization.id !== searchId) {
    const allSubunits = getAllChildOrganizations(organization.hasPart);
    if (!allSubunits.some((subunit) => subunit.id === searchId)) {
      return null; // Hide this element if the searched ID is not a part of this unit
    }
  }

  const subunitsCount = organization.hasPart?.length ?? 0;

  return (
    <Accordion
      elevation={2}
      disableGutters
      sx={{ bgcolor: level % 2 === 0 ? 'secondary.main' : 'secondary.light' }}
      expanded={expanded || !!searchId}
      onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ visibility: subunitsCount > 0 ? null : 'hidden' }} />}>
        <Box sx={{ width: '100%', display: 'grid', gap: '1rem', gridTemplateColumns: '3fr 3fr 1fr 1fr' }}>
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography>{getLanguageString(organization.labels, 'en')}</Typography>
          <Typography>{getIdentifierFromId(organization.id)}</Typography>
          <Typography>{subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}</Typography>
        </Box>
      </AccordionSummary>
      {subunitsCount > 0 && (
        <AccordionDetails>
          {/* <Box sx={{ display: 'flex', flexDirection: 'column' }}> */}
          {organization.hasPart?.map((subunit) => (
            <OrganizationLevel key={subunit.id} organization={subunit} level={level + 1} searchId={searchId} />
          ))}
          {/* </Box> */}
        </AccordionDetails>
      )}
    </Accordion>
  );
};
