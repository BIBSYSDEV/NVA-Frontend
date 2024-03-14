import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
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

      <Typography sx={{ mb: '2rem' }}>
        <Trans t={t} i18nKey="editor.institution.institution_helper_text">
          <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
        </Trans>
      </Typography>

      {organizationQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {organizationQuery.data?.hasPart?.map((organization) => (
            <OrganizationLevel key={organization.id} organization={organization} />
          ))}
        </Box>
      )}
    </>
  );
};

interface OrganizationLevelProps {
  organization: Organization;
}

const OrganizationLevel = ({ organization }: OrganizationLevelProps) => {
  return (
    <Accordion elevation={2} disableGutters sx={{ bgcolor: 'secondary.main' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr auto', width: '100%' }}>
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography>{getLanguageString(organization.labels, 'en')}</Typography>
          <Typography sx={{ minWidth: '8rem' }}>{getIdentifierFromId(organization.id)}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {organization.hasPart?.map((subunit) => <OrganizationLevel key={subunit.id} organization={subunit} />)}
      </AccordionDetails>
    </Accordion>
  );
};
