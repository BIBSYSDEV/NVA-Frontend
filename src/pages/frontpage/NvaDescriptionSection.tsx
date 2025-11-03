import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { TypeCard } from './TypeCard';
import { FrontPageBox } from './styles';
import { SearchTypeValue } from '../search/SearchTypeDropdown';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PersonIcon } from '../../components/atoms/PersonIcon';
import { dataTestId } from '../../utils/dataTestIds';
import { ProjectIcon } from '../../components/atoms/ProjectIcon';
import { RegistrationIcon } from '../../components/atoms/RegistrationIcon';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { useSearchForPerson } from '../../api/hooks/useSearchForPerson';
import { useFetchProjects } from '../../api/hooks/useFetchProjects';
import { getUrlParams } from './utils';
import { SearchParam } from '../../utils/searchHelpers';

const iconStyle = { height: { xs: '1.5rem', sm: '2rem' }, width: { xs: '1.5rem', sm: '2rem' } };

export const NvaDescriptionSection = () => {
  const { t } = useTranslation();

  const registrationQuery = useRegistrationSearch({ params: { aggregation: 'all', results: 0 } });
  const personQuery = useSearchForPerson({ results: 1 });
  const projectsQuery = useFetchProjects({ results: 1 });

  return (
    <FrontPageBox sx={{ bgcolor: 'white', alignItems: 'center', gap: '0.75rem' }}>
      <Trans
        t={t}
        i18nKey="what_you_find_in_nva_description"
        components={{
          heading: <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#120732', mt: '1.25rem' }} />,
          p: <Typography sx={{ color: '#120732', textAlign: 'center' }} />,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          mt: { xs: '0.25rem', sm: '1rem' },
          gap: { xs: '1rem', sm: '0.5rem', md: '2rem' },
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
        <TypeCard
          text={t('projects')}
          icon={<ProjectIcon sx={iconStyle} />}
          number={projectsQuery.data?.size}
          isLoadingNumber={projectsQuery.isPending}
          dataTestId={dataTestId.frontPage.projectsLink}
          to={{ pathname: UrlPathTemplate.Filter, search: getUrlParams(SearchParam.Type, SearchTypeValue.Project) }}
        />
        <TypeCard
          text={t('results')}
          icon={<RegistrationIcon sx={iconStyle} />}
          number={registrationQuery.data?.totalHits}
          isLoadingNumber={registrationQuery.isPending}
          dataTestId={dataTestId.frontPage.registrationsLink}
          to={{ pathname: UrlPathTemplate.Filter }}
        />
        <TypeCard
          text={t('person_profiles')}
          icon={<PersonIcon sx={iconStyle} />}
          number={personQuery.data?.size}
          isLoadingNumber={personQuery.isPending}
          dataTestId={dataTestId.frontPage.personsLink}
          to={{ pathname: UrlPathTemplate.Filter, search: getUrlParams(SearchParam.Type, SearchTypeValue.Person) }}
        />
      </Box>
    </FrontPageBox>
  );
};
