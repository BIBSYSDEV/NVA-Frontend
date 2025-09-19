import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { SearchTypeValue } from '../search/SearchTypeDropdown';
import { ProjectIcon } from '../../components/atoms/ProjectIcon';
import { RegistrationIcon } from '../../components/atoms/RegistrationIcon';
import { PersonIcon } from '../../components/atoms/PersonIcon';
import { TFunction } from 'i18next';

const renderText = (type: SearchTypeValue, t: TFunction<'translation'>) => {
  switch (type) {
    case SearchTypeValue.Person:
      return t('person_profiles');
    case SearchTypeValue.Project:
      return t('projects');
    case SearchTypeValue.Result:
      return t('results');
    default:
      return t('results');
  }
};

interface TypeCardProps {
  type: SearchTypeValue;
}

export const TypeCard = ({ type }: TypeCardProps) => {
  const { t } = useTranslation();
  const icon =
    type === SearchTypeValue.Person ? (
      <PersonIcon />
    ) : type === SearchTypeValue.Project ? (
      <ProjectIcon />
    ) : (
      <RegistrationIcon />
    );

  return (
    <FrontPageBox sx={{ flex: '1', bgcolor: '#EFEFEF', alignItems: 'center', p: '1.5rem' }}>
      {icon}
      <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{(47783).toLocaleString('nb-NO')}</Typography>
      <Typography sx={{ fontSize: '0.8rem', textDecoration: 'underline' }}>{renderText(type, t)}</Typography>
    </FrontPageBox>
  );
};
