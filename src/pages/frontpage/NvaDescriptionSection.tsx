import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { TypeCard } from './TypeCard';
import { FrontPageBox } from './styles';
import { SearchTypeValue } from '../search/SearchTypeDropdown';
import { SearchParam } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PersonIcon } from '../../components/atoms/PersonIcon';
import { dataTestId } from '../../utils/dataTestIds';
import { ProjectIcon } from '../../components/atoms/ProjectIcon';
import { RegistrationIcon } from '../../components/atoms/RegistrationIcon';

const getUrlParams = (type: SearchTypeValue) => {
  const searchParams = new URLSearchParams();
  searchParams.set(SearchParam.Type, type);
  return searchParams.toString();
};

export const NvaDescriptionSection = () => {
  const { t } = useTranslation();

  return (
    <FrontPageBox sx={{ bgcolor: 'white', alignItems: 'center' }}>
      <Trans
        t={t}
        i18nKey="what_you_find_in_nva_description"
        components={{
          heading: <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#120732' }} />,
          p: <Typography sx={{ color: '#120732' }} />,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          mt: '1rem',
          gap: { xs: '1rem', sm: '0.5rem', md: '2rem' },
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
        <TypeCard
          text={t('projects')}
          icon={<ProjectIcon />}
          dataTestId={dataTestId.frontPage.projectsLink}
          pathName={UrlPathTemplate.Root}
          parameters={getUrlParams(SearchTypeValue.Project)}
        />
        <TypeCard
          text={t('results')}
          icon={<RegistrationIcon />}
          dataTestId={dataTestId.frontPage.registrationsLink}
          pathName={UrlPathTemplate.Root}
        />
        <TypeCard
          text={t('person_profiles')}
          icon={<PersonIcon />}
          dataTestId={dataTestId.frontPage.personsLink}
          pathName={UrlPathTemplate.Root}
          parameters={getUrlParams(SearchTypeValue.Person)}
        />
      </Box>
    </FrontPageBox>
  );
};
