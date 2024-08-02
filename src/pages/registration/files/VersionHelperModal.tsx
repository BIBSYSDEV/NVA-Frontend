import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';

import { HelperTextModal } from '../HelperTextModal';

export const VersionHelperModal = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const registratorPublishesMetadataOnly = customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly';

  return (
    <HelperTextModal
      modalTitle={t('common.version')}
      modalDataTestId={dataTestId.registrationWizard.files.versionModal}
      buttonDataTestId={dataTestId.registrationWizard.files.versionHelpButton}>
      {registratorPublishesMetadataOnly ? (
        <>
          <Typography paragraph>{t('registration.files_and_license.version_helper_text_metadata_only')}</Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_accepted_helper_text_metadata_only"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_published_helper_text_metadata_only"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_publishing_agreement_helper_text_metadata_only"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
        </>
      ) : (
        <>
          <Trans
            i18nKey="registration.files_and_license.version_helper_text"
            components={[
              <Typography paragraph key="1" />,
              <Typography paragraph key="2">
                <Box component="span" sx={{ textDecoration: 'underline' }} />
              </Typography>,
            ]}
          />
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_accepted_helper_text"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_published_helper_text"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_publishing_agreement_helper_text"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
          <Typography paragraph>
            <Trans
              i18nKey="registration.files_and_license.version_embargo_helper_text"
              components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
            />
          </Typography>
        </>
      )}
    </HelperTextModal>
  );
};
