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
}

export const NpiLevelTypography = ({ scientificValue, ...typographyProps }: NpiLevelTypographyProps) => {
  const { t } = useTranslation();

  const levelString = scientificValue ? ScientificValueMapper[scientificValue] : null;

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}: {levelString ?? t('common.not_decided')}
    </Typography>
  );
};
