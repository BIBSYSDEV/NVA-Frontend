import { Typography, TypographyProps } from '@mui/material';
import { PublicationInstanceType } from '../../../types/registration.types';
import { useTranslation } from 'react-i18next';

export interface PublicationInstanceTextProps {
  publicationInstanceType?: PublicationInstanceType | '';
  textColor?: TypographyProps['color'];
}

export const PublicationInstanceText = ({ publicationInstanceType, textColor }: PublicationInstanceTextProps) => {
  const { t } = useTranslation();

  return (
    <Typography color={textColor}>
      {publicationInstanceType ? t(`registration.publication_types.${publicationInstanceType}`) : t('common.result')}
    </Typography>
  );
};
