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
  channelId?: string;
}

export const NpiLevelTypography = ({ scientificValue, channelId, ...typographyProps }: NpiLevelTypographyProps) => {
  const { t } = useTranslation();

  const levelString = scientificValue ? ScientificValueMapper[scientificValue] : null;
  const year = channelId?.split('/').pop();
  const yearString = year?.match(/^\d{4}$/) ? ` (${year}) ` : '';

  return (
    <Typography {...typographyProps}>
      {t('registration.resource_type.level')}
      {yearString}: {levelString ?? t('common.not_decided')}
    </Typography>
  );
};
