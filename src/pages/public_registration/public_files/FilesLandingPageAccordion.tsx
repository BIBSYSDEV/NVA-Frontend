import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  getAssociatedFiles,
  isTypeWithFileVersionField,
  userCanEditRegistration,
} from '../../../utils/registration-helpers';
import { PublicRegistrationContentProps } from '../PublicRegistrationContent';
import { FileRow } from './FileRow';

const maxFileSizeForPreview = 10_000_000; //10 MB

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const userIsRegistrationAdmin = userCanEditRegistration(user, registration);

  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);
  const publishedFiles = associatedFiles.filter((file) => file.type === 'PublishedFile');
  const unpublishedFiles = associatedFiles.filter((file) => file.type === 'UnpublishedFile');
  const publishableFilesLength = publishedFiles.length + unpublishedFiles.length;

  const filesToShow = userIsRegistrationAdmin ? associatedFiles : publishedFiles;

  const showFileVersionField = isTypeWithFileVersionField(
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  return publishableFilesLength > 0 || (userIsRegistrationAdmin && associatedFiles.length > 0) ? (
    <LandingPageAccordion
      dataTestId={dataTestId.registrationLandingPage.filesAccordion}
      defaultExpanded={filesToShow.length > 0}
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
          {unpublishedFiles.length > 0 && (
            <Box sx={{ bgcolor: 'secondary.dark', p: { xs: '0.25rem 0.5rem', sm: '0.3rem 3rem' } }}>
              {t('registration.files_and_license.files_awaits_approval', { count: unpublishedFiles.length })}
            </Box>
          )}
        </Box>
      }>
      {filesToShow.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationIdentifier={registration.identifier}
          openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
          showFileVersionField={showFileVersionField}
        />
      ))}
    </LandingPageAccordion>
  ) : null;
};
