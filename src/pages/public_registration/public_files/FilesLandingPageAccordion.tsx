import FileUploadIcon from '@mui/icons-material/FileUpload';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { SelectableButton } from '../../../components/SelectableButton';
import { RegistrationStatus, RegistrationTab } from '../../../types/registration.types';
import { LocalStorageKey } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  associatedArtifactIsNullArtifact,
  getAssociatedFiles,
  isOpenFile,
  isPendingOpenFile,
  isTypeWithFileVersionField,
  userHasAccessRight,
} from '../../../utils/registration-helpers';
import { getRegistrationWizardLink } from '../../../utils/urlPaths';
import { PublicRegistrationContentProps } from '../PublicRegistrationContent';
import { FileRow } from './FileRow';

const maxFileSizeForPreview = 10_000_000; //10 MB

enum FileTab {
  OpenFiles,
  InternalFiles,
}

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';

  const userIsRegistrationAdmin = userHasAccessRight(registration, 'update');
  const [selectedTab, setSelectedTab] = useState(FileTab.OpenFiles);

  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);
  const canSeeInternalFile = associatedFiles.some(
    (file) => file.type === 'InternalFile' || file.type === 'PendingInternalFile' || file.type === 'HiddenFile'
  );
  const openFiles = associatedFiles.filter(isOpenFile);
  const pendingOpenFiles = associatedFiles.filter(isPendingOpenFile);
  const publishableFilesLength = openFiles.length + pendingOpenFiles.length;
  const openFilesToShow = userIsRegistrationAdmin ? [...openFiles, ...pendingOpenFiles] : openFiles;

  const internalFiles = associatedFiles.filter((file) => file.type === 'InternalFile');
  const pendingInternalFiles = associatedFiles.filter((file) => file.type === 'PendingInternalFile');
  const hiddenFiles = associatedFiles.filter((file) => file.type === 'HiddenFile');
  const internalFilesToShow = [...internalFiles, ...pendingInternalFiles, ...hiddenFiles];

  const showFileVersionField = isTypeWithFileVersionField(
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  const registrationMetadataIsPublished =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.PublishedMetadata;

  const showLinkToUploadNewFiles =
    userIsRegistrationAdmin &&
    publishableFilesLength === 0 &&
    !registration.associatedArtifacts.some(associatedArtifactIsNullArtifact);

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
          {registrationMetadataIsPublished && pendingOpenFiles.length > 0 && (
            <Typography sx={{ bgcolor: 'secondary.dark', p: { xs: '0.25rem 0.5rem', sm: '0.3rem 3rem' } }}>
              {t('registration.files_and_license.files_awaits_approval', { count: pendingOpenFiles.length })}
            </Typography>
          )}
        </Box>
      }>
      {showLinkToUploadNewFiles && (
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
          <SelectableButton
            data-testid={dataTestId.registrationLandingPage.addLinkOrFilesButton}
            startIcon={<FileUploadIcon />}
            to={getRegistrationWizardLink(registration.identifier, { tab: RegistrationTab.FilesAndLicenses })}>
            {t('registration.files_and_license.add_files_or_links')}
          </SelectableButton>
        </Box>
      )}

      {canSeeInternalFile && (
        <BetaFunctionality>
          <TabContext value={selectedTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={(_, value) => setSelectedTab(value)}
                aria-label="lab API tabs example (TODO)"
                variant="fullWidth">
                <Tab label={`Offentlige filer (${openFilesToShow.length})`} value={FileTab.OpenFiles} />
                <Tab label={`Interne filer (${internalFilesToShow.length})`} value={FileTab.InternalFiles} />
              </TabList>
            </Box>
            <TabPanel value={FileTab.OpenFiles}>
              {openFilesToShow.map((file, index) => (
                <FileRow
                  key={file.identifier}
                  file={file}
                  registrationIdentifier={registration.identifier}
                  openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
                  showFileVersionField={showFileVersionField}
                  registrationMetadataIsPublished={registrationMetadataIsPublished}
                />
              ))}
            </TabPanel>
            <TabPanel value={FileTab.InternalFiles}>
              {internalFilesToShow.map((file, index) => (
                <FileRow
                  key={file.identifier}
                  file={file}
                  registrationIdentifier={registration.identifier}
                  openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
                  showFileVersionField={showFileVersionField}
                  registrationMetadataIsPublished={registrationMetadataIsPublished}
                />
              ))}
            </TabPanel>
          </TabContext>
        </BetaFunctionality>
      )}

      {(!betaEnabled || !canSeeInternalFile) && (
        <>
          {openFilesToShow.map((file, index) => (
            <FileRow
              key={file.identifier}
              file={file}
              registrationIdentifier={registration.identifier}
              openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
              showFileVersionField={showFileVersionField}
              registrationMetadataIsPublished={registrationMetadataIsPublished}
            />
          ))}
        </>
      )}
    </LandingPageAccordion>
  ) : null;
};
