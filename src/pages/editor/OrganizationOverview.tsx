import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../api/commonApi';
import { ListSkeleton } from '../../components/ListSkeleton';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const OrganizationOverview = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;

  const organizationQuery = useQuery({
    queryKey: [organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => getById<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  if (!organizationId) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{t('editor.organization_overview')}</title>
      </Helmet>
      <Typography variant="h1" sx={{ mb: '1rem' }}>
        {t('editor.organization_overview')}
      </Typography>

      <Typography sx={{ mb: '2rem' }}>Ved behov for endringer, kontakt Sikt.</Typography>

      {organizationQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : (
        <>
          {organizationQuery.data?.hasPart?.map((organization) => (
            <OrganizationLevel key={organization.id} organization={organization} />
          ))}
        </>
      )}
    </>
  );
};

interface OrganizationLevelProps {
  organization: Organization;
}

const OrganizationLevel = ({ organization }: OrganizationLevelProps) => {
  const hasSubunits = organization.hasPart && organization.hasPart.length > 0;

  return (
    <Accordion elevation={5} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr auto', width: '100%' }}>
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography>{getLanguageString(organization.labels, 'en')}</Typography>
          <Typography sx={{ mr: '2rem' }}>{getIdentifierFromId(organization.id)}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {organization.hasPart?.map((subunit) => <OrganizationLevel key={subunit.id} organization={subunit} />)}
      </AccordionDetails>
    </Accordion>
  );
};
