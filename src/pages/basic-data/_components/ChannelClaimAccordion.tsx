import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/_atoms/NavigationList';
import { SelectableButton } from '../../../components/buttons/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkWhichBasicDataPage } from '../../../utils/location-helpers/check-which-basic-data-page';
import { UrlPathTemplate } from '../../../utils/urlPaths';

export const ChannelClaimAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isOnPublisherClaimPage, isOnSerialPublicationClaimsPage } = checkWhichBasicDataPage(
    location.pathname,
    location.search
  );

  return (
    <NavigationListAccordion
      title={t('editor.institution.channel_claims.channel_claim')}
      startIcon={<LockOutlineIcon sx={{ bgcolor: 'grey.500' }} />}
      accordionPath={UrlPathTemplate.BasicDataChannelClaims}
      defaultPath={UrlPathTemplate.BasicDataPublisherClaims}
      dataTestId={dataTestId.basicData.channelClaimLink}>
      <NavigationList aria-label={t('editor.institution.channel_claims.channel_claim')}>
        <Typography sx={{ mt: '0.5rem' }}>
          {t('editor.institution.channel_claims.channel_claims_settings_description')}
        </Typography>
        <SelectableButton
          isSelected={isOnPublisherClaimPage}
          data-testid={dataTestId.basicData.publisherClaimsLink}
          to={UrlPathTemplate.BasicDataPublisherClaims}>
          {t('editor.institution.channel_claims.administer_publisher_channel_claim')}
        </SelectableButton>
        <SelectableButton
          isSelected={isOnSerialPublicationClaimsPage}
          data-testid={dataTestId.basicData.serialPublicationClaimsLink}
          to={UrlPathTemplate.BasicDataSerialPublicationClaims}>
          {t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}
        </SelectableButton>
      </NavigationList>
    </NavigationListAccordion>
  );
};
