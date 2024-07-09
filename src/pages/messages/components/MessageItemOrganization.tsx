import { Skeleton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { StyledTruncatableTypography } from '../../../components/styled/Wrappers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface MessageItemOrganizationProps {
  organizationId: string;
}

export const MessageItemOrganization = ({ organizationId }: MessageItemOrganizationProps) => {
  const { t } = useTranslation();
  const organizationQuery = useFetchOrganization(organizationId);
  const organizationName = getLanguageString(organizationQuery.data?.labels);

  return (
    <Tooltip title={organizationName}>
      <StyledTruncatableTypography sx={{ gridColumn: '1/-1' }}>
        {organizationQuery.isPending ? (
          <Skeleton sx={{ width: '80%' }} />
        ) : organizationName ? (
          organizationName
        ) : (
          <i>{t('common.unknown')}</i>
        )}
      </StyledTruncatableTypography>
    </Tooltip>
  );
};
