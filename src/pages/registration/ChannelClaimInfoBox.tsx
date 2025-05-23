import LockIcon from '@mui/icons-material/Lock';
import { Box, Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { RootState } from '../../redux/store';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { Registration } from '../../types/registration.types';
import { isDegree } from '../../utils/registration-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

interface ChannelClaimInfoBoxProps {
  channelClaim: ClaimedChannel;
  registration: Registration;
}

export const ChannelClaimInfoBox = ({ channelClaim, registration }: ChannelClaimInfoBoxProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const organizationQuery = useFetchOrganization(channelClaim.claimedBy.organizationId);

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
        <Typography variant="h2">{t('registration.channel_claim_info_heading')}</Typography>
        <Typography>
          <Trans
            i18nKey="registration.channel_claim_info_owned_by"
            components={{
              institution: organizationQuery.isPending ? (
                <Skeleton sx={{ display: 'inline-block', width: '12rem' }} />
              ) : (
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {getLanguageString(organizationQuery.data?.labels)}
                </Typography>
              ),
            }}
          />
        </Typography>

        {/* TODO "Check for unused keys after evaluation fomr test group */}
        <Trans
          // i18nKey="registration.use_curator_help_button"
          values={{ buttonText: t('my_page.messages.get_curator_support') }}
          components={{ p: <Typography /> }}
        />
      </div>
    </Box>
  );
};
