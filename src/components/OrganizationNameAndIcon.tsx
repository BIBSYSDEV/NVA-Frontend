import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, BoxProps, Skeleton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../api/apiPaths';
import { useFetchOrganization } from '../api/hooks/useFetchOrganization';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationNameAndIconProps extends Pick<BoxProps, 'sx'> {
  id: string;
}

export const OrganizationNameAndIcon = ({ id, sx }: OrganizationNameAndIconProps) => {
  const { t } = useTranslation();

  const isValidOrgId = id && id.includes(CristinApiPath.Organization);
  const organizationQuery = useFetchOrganization(isValidOrgId ? id : '');
  const orgName = getLanguageString(organizationQuery.data?.labels);
  const orgAcronym = organizationQuery.data?.acronym;
  const displayName = isValidOrgId ? orgAcronym : id + 'sdfgsdfdsfdsfsdfsqqqqqqaaasadfsdfsfddssdfq';

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
      ) : displayName ? (
        <Tooltip title={orgName}>
          <Typography sx={{ maxWidth: '5rem' }} noWrap overflow="hidden">
            {displayName}
          </Typography>
        </Tooltip>
      ) : (
        <Typography>
          <i>{t('common.unknown')}</i>
        </Typography>
      )}
    </Box>
  );
};
