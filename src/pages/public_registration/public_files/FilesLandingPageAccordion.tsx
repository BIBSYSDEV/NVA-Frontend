import FileUploadIcon from '@mui/icons-material/FileUpload';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, styled, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { SelectableButton } from '../../../components/SelectableButton';
import { RegistrationStatus, RegistrationTab } from '../../../types/registration.types';
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

const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontSize: '1rem',
});

const StyledTabLabelContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
});

const StyledPendingFilesInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: theme.palette.secondary.dark,
  padding: '0.25rem 0.5rem',
}));

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const userIsRegistrationAdmin = userHasAccessRight(registration, 'update');
  const [selectedTab, setSelectedTab] = useState(FileTab.OpenFiles);

  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);

  const pendingOpenFiles = associatedFiles.filter(isPendingOpenFile);
  const pendingInternalFiles = associatedFiles.filter((file) => file.type === 'PendingInternalFile');
  const totalPendingFiles = pendingOpenFiles.length + pendingInternalFiles.length;

  const openableFilesToShow = userIsRegistrationAdmin
    ? associatedFiles.filter((file) => isOpenFile(file) || isPendingOpenFile(file))
    : associatedFiles.filter(isOpenFile);

  const internalFilesToShow = associatedFiles.filter(
    (file) => file.type === 'InternalFile' || file.type === 'PendingInternalFile' || file.type === 'HiddenFile'
  );

  const totalFiles = openableFilesToShow.length + internalFilesToShow.length;

  const showFileVersionField = isTypeWithFileVersionField(
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  const registrationMetadataIsPublished =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.PublishedMetadata;

  const showLinkToUploadNewFiles =
    userIsRegistrationAdmin &&
    totalFiles === 0 &&
    !registration.associatedArtifacts.some(associatedArtifactIsNullArtifact);

  return totalFiles > 0 ||
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
            {t('registration.files_and_license.files_count', { count: totalFiles })}
          </Typography>
          {registrationMetadataIsPublished && totalPendingFiles > 0 && (
            <StyledPendingFilesInfo sx={{ px: { xs: '0.5rem', sm: '3rem' } }}>
              <HourglassEmptyIcon fontSize="small" />
              <Typography>
                {t('registration.files_and_license.files_awaits_approval', { count: totalPendingFiles })}
              </Typography>
            </StyledPendingFilesInfo>
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

      {internalFilesToShow.length > 0 ? (
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={(_, value) => setSelectedTab(value)}
              aria-label={t('registration.public_page.files_tab_list_label')}
              variant="fullWidth">
              <StyledTab
                data-testid={dataTestId.registrationLandingPage.publicFilesTab}
                label={
                  <StyledTabLabelContainer>
                    {t('registration.public_page.public_files', { count: openableFilesToShow.length })}
                    {pendingOpenFiles.length > 0 && (
                      <StyledPendingFilesInfo>
                        <HourglassEmptyIcon fontSize="small" />
                        <Typography>
                          {t('registration.public_page.files.awaits_approval', { count: pendingOpenFiles.length })}
                        </Typography>
                      </StyledPendingFilesInfo>
                    )}
                  </StyledTabLabelContainer>
                }
                value={FileTab.OpenFiles}
              />
              <StyledTab
                data-testid={dataTestId.registrationLandingPage.internalFilesTab}
                label={
                  <StyledTabLabelContainer>
                    {t('registration.public_page.internal_files', { count: internalFilesToShow.length })}
                    {pendingInternalFiles.length > 0 && (
                      <StyledPendingFilesInfo>
                        <HourglassEmptyIcon fontSize="small" />
                        <Typography>
                          {t('registration.public_page.files.awaits_approval', { count: pendingInternalFiles.length })}
                        </Typography>
                      </StyledPendingFilesInfo>
                    )}
                  </StyledTabLabelContainer>
                }
                value={FileTab.InternalFiles}
              />
            </TabList>
          </Box>
          <TabPanel value={FileTab.OpenFiles}>
            {openableFilesToShow.length === 0 ? (
              <Typography>{t('registration.public_page.no_public_files')}</Typography>
            ) : (
              openableFilesToShow.map((file, index) => (
                <FileRow
                  key={file.identifier}
                  file={file}
                  registrationIdentifier={registration.identifier}
                  openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
                  showFileVersionField={showFileVersionField}
                  registrationMetadataIsPublished={registrationMetadataIsPublished}
                />
              ))
            )}
          </TabPanel>
          <TabPanel value={FileTab.InternalFiles}>
            {internalFilesToShow.map((file) => (
              <FileRow
                key={file.identifier}
                file={file}
                registrationIdentifier={registration.identifier}
                openPreviewByDefault={false}
                showFileVersionField={false}
                registrationMetadataIsPublished={registrationMetadataIsPublished}
              />
            ))}
          </TabPanel>
        </TabContext>
      ) : (
        openableFilesToShow.map((file, index) => (
          <FileRow
            key={file.identifier}
            file={file}
            registrationIdentifier={registration.identifier}
            openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
            showFileVersionField={showFileVersionField}
            registrationMetadataIsPublished={registrationMetadataIsPublished}
          />
        ))
      )}
    </LandingPageAccordion>
  ) : null;
};
