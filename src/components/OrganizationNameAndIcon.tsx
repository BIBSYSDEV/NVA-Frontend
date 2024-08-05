import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, BoxProps, Skeleton, Tooltip, Typography } from '@mui/material';
import { useFetchOrganization } from '../api/hooks/useFetchOrganization';
import { getLanguageString } from '../utils/translation-helpers';
import { useTranslation } from 'react-i18next';

interface OrganizationNameAndIconProps extends Pick<BoxProps, 'sx'> {
  id: string;
  acronym?: boolean;
}

export const OrganizationNameAndIcon = ({ id, acronym = false, sx }: OrganizationNameAndIconProps) => {
  const { t } = useTranslation();
  const organizationQuery = useFetchOrganization(id);
  const orgName = getLanguageString(organizationQuery.data?.labels);
  const orgAcronym = organizationQuery.data?.acronym;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <AccountBalanceIcon
        color="primary"
        sx={{
          mr: '0.3rem',
          height: '1rem',
          width: '1rem',
        }}
      />
      {organizationQuery.isLoading ? (
        <Skeleton sx={{ width: '2.5rem' }} />
      ) : acronym && orgAcronym ? (
        <Tooltip title={orgName}>
          <Typography>{orgAcronym}</Typography>
        </Tooltip>
      ) : orgName ? (
        <Typography>{orgName}</Typography>
      ) : (
        <Typography>
          <i>{t('common.unknown')}</i>
        </Typography>
      )}
    </Box>
  );
};
