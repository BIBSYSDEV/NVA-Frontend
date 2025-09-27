import { Chip, ChipProps, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface ViewingScopeChipProps extends ChipProps {
  organizationId: string;
}

export const ViewingScopeChip = ({ organizationId, color, ...props }: ViewingScopeChipProps) => {
  const { t } = useTranslation();

  const organizationQuery = useFetchOrganization(organizationId);

  return (
    <Chip
      color={color ? color : 'secondary'}
      variant="filled"
      {...props}
      label={
        organizationQuery.isPending ? (
          <Skeleton sx={{ width: '15rem' }} />
        ) : organizationQuery.data?.labels ? (
          getLanguageString(organizationQuery.data.labels)
        ) : (
          t('common.unknown')
        )
      }
    />
  );
};
