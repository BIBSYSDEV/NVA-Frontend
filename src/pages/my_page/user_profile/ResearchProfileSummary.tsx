import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PreviewIcon from '@mui/icons-material/Preview';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CristinPerson } from '../../../types/user.types';
import { filterActiveAffiliations } from '../../../utils/user-helpers';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { AccountCircle } from '@mui/icons-material';

export const ResearchProfileSummary = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [person] = useFetch<CristinPerson>({
    url: user?.cristinId ?? '',
    errorMessage: t('feedback.error.get_person'),
  });
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PreviewIcon />
        <Typography variant="overline">{t('my_page.my_profile.research_profile_summary.preview')}</Typography>
      </Box>

      <Typography variant="h2">{t('my_page.my_profile.research_profile_summary.research_profile')}</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '0.5rem', mt: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Typography variant="h3">
            {user?.givenName} {user?.familyName}
          </Typography>
          <img src={orcidIcon} height="20" alt={t('common.orcid')} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <AccountCircle fontSize="large" />
        </Box>
      </Box>

      <Typography>{user?.feideId}</Typography>
      <Divider sx={{ mt: '3rem' }} />
      {activeAffiliations.map((affiliation) => {
        return <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />;
      })}
    </Box>
  );
};
