import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { getLanguageString } from '../../../utils/translation-helpers';

interface MessageItemOrganizationProps {
  organizationId: string;
}

export const MessageItemOrganization = ({ organizationId }: MessageItemOrganizationProps) => {
  const { t } = useTranslation();
  const organizationQuery = useFetchOrganization(organizationId);

  const acronym = organizationQuery.data?.acronym;
  const organizationName = getLanguageString(organizationQuery.data?.labels);

  return (
    <Tooltip title={organizationName}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
        <AccountBalanceIcon fontSize="small" />
        <Typography>
          {organizationQuery.isPending ? (
            <Skeleton sx={{ width: '2rem' }} />
          ) : acronym ? (
            acronym
          ) : (
            <i>{t('common.unknown')}</i>
          )}
        </Typography>
      </Box>
    </Tooltip>
  );
};
