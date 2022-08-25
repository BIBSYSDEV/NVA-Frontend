import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CristinPerson, User } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { filterActiveAffiliations } from '../../../utils/user-helpers';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';

interface UserInstituionProps {
  user: User;
}

export const UserAffiliations = ({ user }: UserInstituionProps) => {
  const { t } = useTranslation();
  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: user.cristinId ?? '',
    errorMessage: t('feedback.error.get_person'),
  });
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return (
    <div>
      <Typography variant="h2" id="affiliations-heading">
        {t('my_page.my_profile.heading.affiliations')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
        {isLoadingPerson ? (
          <CircularProgress aria-labelledby="affiliations-heading" />
        ) : (
          activeAffiliations.map((affiliation) => (
            <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
          ))
        )}
      </Box>
    </div>
  );
};
