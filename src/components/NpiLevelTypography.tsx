import { Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScientificValue } from '../types/registration.types';

interface NpiLevelTypographyProps extends TypographyProps {
  level?: string;
}

export const NpiLevelTypography = ({ level, ...typographyProps }: NpiLevelTypographyProps) => {
  const { t } = useTranslation();

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}: {level ?? t('common.not_decided')}
    </Typography>
  );
};

type ScientificValueMapperType = {
  [key in ScientificValue]: string | null;
};

const ScientificValueMapper: ScientificValueMapperType = {
  Unassigned: null,
  LevelZero: '0',
  LevelOne: '1',
  LevelTwo: '2',
};

interface NpiLevelTypographyProps2 extends TypographyProps {
  scientificValue?: ScientificValue;
}

export const NpiLevelTypography2 = ({ scientificValue, ...typographyProps }: NpiLevelTypographyProps2) => {
  const { t } = useTranslation();

  const levelString = scientificValue ? ScientificValueMapper[scientificValue] : null;

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}: {levelString ?? t('common.not_decided')}
    </Typography>
  );
};
