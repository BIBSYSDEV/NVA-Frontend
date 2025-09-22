import { useTranslation } from 'react-i18next';
import { Box, Link, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { SearchTypeValue } from '../search/SearchTypeDropdown';
import { ProjectIcon } from '../../components/atoms/ProjectIcon';
import { RegistrationIcon } from '../../components/atoms/RegistrationIcon';
import { PersonIcon } from '../../components/atoms/PersonIcon';
import { TFunction } from 'i18next';
import { Link as RouterLink } from 'react-router';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';

const getValuesFromType = (type: SearchTypeValue, t: TFunction<'translation'>) => {
  const searchParams = new URLSearchParams();
  searchParams.set(SearchParam.Type, type);
  const navigationObject = {
    pathname: UrlPathTemplate.Root,
    search: searchParams.toString(),
  };

  switch (type) {
    case SearchTypeValue.Person:
      return {
        text: t('person_profiles'),
        icon: <PersonIcon />,
        dataTestId: dataTestId.frontPage.personsLink,
        navigationObject: navigationObject,
      };
    case SearchTypeValue.Project:
      return {
        text: t('projects'),
        icon: <ProjectIcon />,
        dataTestId: dataTestId.frontPage.projectsLink,
        navigationObject: navigationObject,
      };
    case SearchTypeValue.Result:
    default:
      return {
        text: t('results'),
        icon: <RegistrationIcon />,
        dataTestId: dataTestId.frontPage.registrationsLink,
        navigationObject: {
          pathname: UrlPathTemplate.Root,
        },
      };
  }
};

interface TypeCardProps {
  type: SearchTypeValue;
}

export const TypeCard = ({ type }: TypeCardProps) => {
  const { t } = useTranslation();
  const { text, icon, dataTestId, navigationObject } = getValuesFromType(type, t);

  return (
    <Link
      component={RouterLink}
      data-testid={dataTestId}
      to={navigationObject}
      sx={{ width: '100%', textDecoration: 'none' }}>
      <FrontPageBox
        sx={{ flex: '1', bgcolor: '#EFEFEF', alignItems: 'center', p: '1.5rem', cursor: 'pointer', height: '8rem' }}>
        <Box
          sx={{
            flexGrow: 1,
            alignContent: 'center',
          }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: '0.8rem', textDecoration: 'underline' }}>{text}</Typography>
      </FrontPageBox>
    </Link>
  );
};
