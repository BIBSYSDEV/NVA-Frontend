import ErrorIcon from '@mui/icons-material/Error';
import { Box, Skeleton, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchChannelClaim } from '../../../../api/hooks/useFetchChannelClaim';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { StyledInfoBanner } from '../../../../components/styled/Wrappers';
import { RootState } from '../../../../redux/store';
import { Registration } from '../../../../types/registration.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface ClaimedChannelInfoBoxProps {
  channelId: string;
  channelType: string;
}

export const ClaimedChannelInfoBox = ({ channelId, channelType }: ClaimedChannelInfoBoxProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const { values } = useFormikContext<Registration>();

  const channelClaimQuery = useFetchChannelClaim(channelId, { ignoreErrorMessage: true });
  const channelClaim = channelClaimQuery.data;

  const organizationQuery = useFetchOrganization(channelClaim?.claimedBy.organizationId ?? '');

  if (!channelClaim || !values.entityDescription?.reference?.publicationInstance?.type) {
    return null;
  }

  const claimsThisCategory = channelClaim.channelClaim.constraint.scope.includes(
    values.entityDescription.reference.publicationInstance.type
  );
  const claimedBySameInstitutionAsUser = channelClaim.claimedBy.organizationId === user?.topOrgCristinId;

  if (!claimsThisCategory || claimedBySameInstitutionAsUser) {
    return null;
  }

  return (
    <StyledInfoBanner sx={{ gridColumn: '1/-1' }}>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <ErrorIcon />
        <div>
          <Typography color="inherit">
            {t('registration.resource_type.channel_claimed_by_other_institution', { channelType })}
          </Typography>
          <Typography color="inherit">
            <Trans
              i18nKey="registration.resource_type.files_will_be_handled_by_other_institution"
              components={{
                institution: organizationQuery.isPending ? (
                  <Skeleton sx={{ width: '12rem', display: 'inline-block' }} />
                ) : (
                  <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {getLanguageString(organizationQuery.data?.labels)}
                  </Box>
                ),
              }}
            />
          </Typography>
        </div>
      </Box>
    </StyledInfoBanner>
  );
};
