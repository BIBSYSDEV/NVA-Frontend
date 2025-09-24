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
import { getUrlParams } from './utils';
import { SearchParam } from '../../utils/searchHelpers';

export const NvaDescriptionSection = () => {
  const { t } = useTranslation();
  const iconStyle = { height: '2rem', width: '2rem' };

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
          icon={<ProjectIcon sx={iconStyle} />}
          dataTestId={dataTestId.frontPage.projectsLink}
          to={{ pathname: UrlPathTemplate.Root, search: getUrlParams(SearchParam.Type, SearchTypeValue.Project) }}
        />
        <TypeCard
          text={t('results')}
          icon={<RegistrationIcon sx={iconStyle} />}
          dataTestId={dataTestId.frontPage.registrationsLink}
          to={{ pathname: UrlPathTemplate.Root }}
        />
        <TypeCard
          text={t('person_profiles')}
          icon={<PersonIcon sx={iconStyle} />}
          dataTestId={dataTestId.frontPage.personsLink}
          to={{ pathname: UrlPathTemplate.Root, search: getUrlParams(SearchParam.Type, SearchTypeValue.Person) }}
        />
      </Box>
    </FrontPageBox>
  );
};
