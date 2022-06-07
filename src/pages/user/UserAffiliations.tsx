import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { CristinPerson, User } from '../../types/user.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { filterActiveAffiliations } from '../../utils/user-helpers';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';

interface UserInstituionProps {
  user: User;
}

export const UserAffiliations = ({ user }: UserInstituionProps) => {
  const { t } = useTranslation('profile');
  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: user.cristinId ?? '',
    errorMessage: t('feedback:error.get_person'),
  });
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return (
    <BackgroundDiv>
      <Typography variant="h2">{t('heading.affiliations')}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
        {isLoadingPerson ? (
          <CircularProgress />
        ) : (
          activeAffiliations.map((affiliation) => (
            <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
          ))
        )}
      </Box>
    </BackgroundDiv>
  );
};
