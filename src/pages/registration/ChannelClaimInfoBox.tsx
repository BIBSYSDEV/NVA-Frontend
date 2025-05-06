import LockIcon from '@mui/icons-material/Lock';
import { Box, Skeleton, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimInfoBoxProps {
  organizationId: string;
}

export const ChannelClaimInfoBox = ({ organizationId }: ChannelClaimInfoBoxProps) => {
  const organizationQuery = useFetchOrganization(organizationId);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        bgcolor: 'grey.400',
        p: '1rem 0.5rem',
        borderRadius: '0.5rem',
        mb: '1rem',
      }}>
      <LockIcon fontSize="large" />
      <div>
        <Trans
          i18nKey="registration.disable_fields_due_to_channel_claim"
          components={{
            heading: <Typography variant="h2" />,
            p: <Typography sx={{ display: 'flex' }} />,
            institution: organizationQuery.isPending ? (
              <Skeleton sx={{ width: '12rem' }} />
            ) : (
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {getLanguageString(organizationQuery.data?.labels)}
              </Typography>
            ),
          }}
        />
      </div>
    </Box>
  );
};
