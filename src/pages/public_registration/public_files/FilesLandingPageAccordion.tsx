import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '../../../components/PageWithSideMenu';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { RegistrationStatus } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  getAssociatedFiles,
  isTypeWithFileVersionField,
  userCanEditRegistration,
} from '../../../utils/registration-helpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { PublicRegistrationContentProps } from '../PublicRegistrationContent';
import { FileRow } from './FileRow';

const maxFileSizeForPreview = 10_000_000; //10 MB

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const userIsRegistrationAdmin = userCanEditRegistration(registration);

  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);
  const publishedFiles = associatedFiles.filter((file) => file.type === 'PublishedFile');
  const unpublishedFiles = associatedFiles.filter((file) => file.type === 'UnpublishedFile');
  const publishableFilesLength = publishedFiles.length + unpublishedFiles.length;

  const filesToShow = userIsRegistrationAdmin ? [...publishedFiles, ...unpublishedFiles] : publishedFiles;

  const showFileVersionField = isTypeWithFileVersionField(
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  const registrationMetadataIsPublished =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.PublishedMetadata;

  return publishableFilesLength > 0 ||
    (userIsRegistrationAdmin && associatedFiles.length > 0) ||
    (userIsRegistrationAdmin && registration.associatedArtifacts.length === 0) ? (
    <LandingPageAccordion
      dataTestId={dataTestId.registrationLandingPage.filesAccordion}
      defaultExpanded
      heading={
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'auto auto', sm: '1fr auto 1fr' },
            gap: '0.5rem',
            alignItems: 'center',
          }}>
          <Typography variant="h2" color="primary">
            {t('registration.files_and_license.files_count', { count: publishableFilesLength })}
          </Typography>
          {registrationMetadataIsPublished && unpublishedFiles.length > 0 && (
            <Typography sx={{ bgcolor: 'secondary.dark', p: { xs: '0.25rem 0.5rem', sm: '0.3rem 3rem' } }}>
              {t('registration.files_and_license.files_awaits_approval', { count: unpublishedFiles.length })}
            </Typography>
          )}
        </Box>
      }>
      {registration.associatedArtifacts.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
          <Typography
            sx={{
              py: '0.3rem',
              px: { xs: '2rem', sm: '3rem' },
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
            data-testid={dataTestId.registrationLandingPage.noLinkOrFilesWarning}>
            {t('registration.files_and_license.no_files_or_links_present_in_this_registration')}
          </Typography>
          <LinkButton
            data-testid={dataTestId.registrationLandingPage.addLinkOrFilesButton}
            startIcon={<FileUploadIcon />}
            to={`${getRegistrationWizardPath(registration.identifier)}?tab=3`}>
            {t('registration.files_and_license.add_files_or_links')}
          </LinkButton>
        </Box>
      )}
      {filesToShow.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationIdentifier={registration.identifier}
          openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
          showFileVersionField={showFileVersionField}
          registrationMetadataIsPublished={registrationMetadataIsPublished}
        />
      ))}
    </LandingPageAccordion>
  ) : null;
};
