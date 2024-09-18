import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { RootState } from '../../redux/store';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

export const EditorPortfolio = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const organizationId = user?.topOrgCristinId;

  const registrationQuery = useRegistrationSearch({
    enabled: !!organizationId,
    params: { unit: organizationId },
  });

  return (
    <>
      <Typography variant="h1">{'Resultatportefølje'}</Typography>
      <RegistrationSearch registrationQuery={registrationQuery} />
    </>
  );
};
