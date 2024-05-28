import { Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScientificValue } from '../types/registration.types';

type ScientificValueMapperType = {
  [key in ScientificValue]: string | null;
};

const ScientificValueMapper: ScientificValueMapperType = {
  Unassigned: null,
  LevelZero: '0',
  LevelOne: '1',
  LevelTwo: '2',
};

interface NpiLevelTypographyProps extends TypographyProps {
  scientificValue?: ScientificValue;
  publisherId?: string;
}

export const NpiLevelTypography = ({ scientificValue, publisherId, ...typographyProps }: NpiLevelTypographyProps) => {
  const { t } = useTranslation();

  const levelString = scientificValue ? ScientificValueMapper[scientificValue] : null;
  let year = publisherId ? publisherId.split('/').pop() : '';
  year = year && year.match(/^\d{4}$/) ? ` (${year}) ` : '';

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}
      {year}: {levelString ?? t('common.not_decided')}
    </Typography>
  );
};
