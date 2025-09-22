import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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

export const NVADescriptionSection = () => {
  const { t } = useTranslation();

  return (
    <FrontPageBox sx={{ bgcolor: 'white', alignItems: 'center' }}>
      <Typography component="h2" variant="h2" sx={{ fontSize: '1.5rem', color: '#120732' }}>
        {t('frontpage_box_what_is_in_NVA')}
      </Typography>
      <Typography sx={{ color: '#120732' }}>{t('frontpage_box_NVA_collects_norwegian_science')}</Typography>
      <Typography sx={{ color: '#120732' }}>{t('frontpage_box_NVA_explore_publications')}</Typography>
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
