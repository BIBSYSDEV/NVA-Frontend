import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import Uppy from '@uppy/core';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { InfoBanner } from '../../components/InfoBanner';
import { OpenInNewLink } from '../../components/OpenInNewLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../context/RegistrationFormContext';
import { RootState } from '../../redux/store';
import { FileType, NullAssociatedArtifact } from '../../types/associatedArtifact.types';
import { FileFieldNames, ResourceFieldNames, SpecificLinkFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  allowsFileUpload,
  associatedArtifactIsNullArtifact,
  getAssociatedFiles,
  getAssociatedLinkRelationTitle,
  isOpenFile,
  isPendingOpenFile,
  userHasAccessRight,
  userIsValidImporter,
} from '../../utils/registration-helpers';
import { hasCuratorRole } from '../../utils/user-helpers';
import { FileList } from './FileList';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { HelperTextModal } from './HelperTextModal';
import { ClaimedChannelInfoBox } from './resource_type_tab/components/ClaimedChannelInfoBox';
import { LinkField } from './resource_type_tab/components/LinkField';

const channelRegisterBaseUrl = 'https://kanalregister.hkdir.no/publiseringskanaler/info';
const getChannelRegisterJournalUrl = (pid: string) => `${channelRegisterBaseUrl}/tidsskrift?pid=${pid}`;
const getChannelRegisterPublisherUrl = (pid: string) => `${channelRegisterBaseUrl}/forlag?pid=${pid}`;

interface FilesAndLicensePanelProps {
  uppy?: Uppy;
}

export const FilesAndLicensePanel = ({ uppy }: FilesAndLicensePanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);

  const { disableChannelClaimsFields } = useContext(RegistrationFormContext);

  const { values } = useFormikContext<Registration>();
  const { entityDescription, associatedArtifacts } = values;
  const publicationContext = entityDescription?.reference?.publicationContext;

  const files = useMemo(() => getAssociatedFiles(associatedArtifacts), [associatedArtifacts]);

  const completedFiles = files.filter(
    (file) => isOpenFile(file) || file.type === FileType.InternalFile || file.type === FileType.HiddenFile
  );
  const pendingFiles = files.filter(
    (file) =>
      isPendingOpenFile(file) ||
      file.type === FileType.PendingInternalFile ||
      file.type === FileType.RejectedFile ||
      file.type === FileType.UpdloadedFile
  );

  const isNullAssociatedArtifact =
    associatedArtifacts.length === 1 && associatedArtifacts.some(associatedArtifactIsNullArtifact);

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    // Avoid adding duplicated file names to an existing registration,
    // since files could have been uploaded in another session without being in uppy's current state
    uppy?.setOptions({
      onBeforeFileAdded: (currentFile) => {
        if (filesRef.current.some((file) => file.name === currentFile.name)) {
          uppy.info(t('registration.files_and_license.no_duplicates', { fileName: currentFile.name }), 'info', 6000);
          return false;
        }
        return true;
      },
    });
  }, [t, uppy, filesRef]);

  const publisherId =
    (publicationContext && 'publisher' in publicationContext && publicationContext.publisher?.id) || '';
  const publisherIdentifier = publisherId?.split('/').reverse()[1];

  const seriesId = (publicationContext && 'series' in publicationContext && publicationContext.series?.id) || '';
  const seriesIdentifier = seriesId?.split('/').reverse()[1];

  const journalId = (publicationContext && 'id' in publicationContext && publicationContext.id) || '';
  const journalIdentifier = journalId?.split('/').reverse()[1] || '';

  const originalDoi = entityDescription?.reference?.doi;

  const canEditFilesAndLinks =
    (userHasAccessRight(values, 'partial-update') || userIsValidImporter(user, values)) && !disableChannelClaimsFields;
  const categorySupportsFiles = allowsFileUpload(customer, entityDescription?.reference?.publicationInstance?.type);
  const canUploadFile = userHasAccessRight(values, 'upload-file') && (categorySupportsFiles || hasCuratorRole(user));

  return (
    <FieldArray name={FileFieldNames.AssociatedArtifacts}>
      {({ name, remove, push }: FieldArrayRenderProps) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(publisherIdentifier || seriesIdentifier || journalIdentifier) && (
            <Paper
              elevation={0}
              component={BackgroundDiv}
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Typography variant="h2">{t('registration.files_and_license.info_from_channel_register')}</Typography>
              {journalIdentifier && (
                <OpenInNewLink href={getChannelRegisterJournalUrl(journalIdentifier)}>
                  {t('registration.files_and_license.find_journal_in_channel_register')}
                </OpenInNewLink>
              )}
              {journalId && (
                <ClaimedChannelInfoBox channelId={journalId} channelType={t('registration.resource_type.journal')} />
              )}

              {publisherIdentifier && (
                <OpenInNewLink href={getChannelRegisterPublisherUrl(publisherIdentifier)}>
                  {t('registration.files_and_license.find_publisher_in_channel_register')}
                </OpenInNewLink>
              )}
              {publisherId && <ClaimedChannelInfoBox channelId={publisherId} channelType={t('common.publisher')} />}

              {seriesIdentifier && (
                <OpenInNewLink href={getChannelRegisterJournalUrl(seriesIdentifier)}>
                  {t('registration.files_and_license.find_series_in_channel_register')}
                </OpenInNewLink>
              )}
              {seriesId && (
                <ClaimedChannelInfoBox channelId={seriesId} channelType={t('registration.resource_type.series')} />
              )}
            </Paper>
          )}

          {!isNullAssociatedArtifact && (
            <>
              <Paper
                elevation={0}
                component={BackgroundDiv}
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Typography variant="h2">{t('registration.files_and_license.files')}</Typography>
                  <HelperTextModal
                    modalTitle={t('registration.files_and_license.files')}
                    modalDataTestId={dataTestId.registrationWizard.files.fileHelpModal}
                    buttonDataTestId={dataTestId.registrationWizard.files.fileHelpButton}>
                    <Trans
                      i18nKey="registration.files_and_license.files_helper_text"
                      components={{
                        p: <Typography sx={{ mb: '1rem' }} />,
                        heading: <Typography variant="h2" />,
                      }}
                    />
                    {customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
                      <Typography sx={{ mb: '1rem' }}>
                        {t('registration.files_and_license.files_helper_text_metadata_only')}
                      </Typography>
                    ) : (
                      <Typography sx={{ mb: '1rem' }}>
                        {t('registration.files_and_license.file_helper_text_metadata_and_files', {
                          buttonText: t('my_page.messages.get_curator_support'),
                        })}
                      </Typography>
                    )}
                    <Typography sx={{ mb: '1rem' }}>
                      {t('registration.files_and_license.files_helper_text_paragraph_2')}
                    </Typography>
                    <Trans
                      i18nKey="registration.files_and_license.file_helper_text_point_list"
                      components={{
                        ul: <ul />,
                        li: <li />,
                      }}
                    />
                  </HelperTextModal>
                </Box>
                {!categorySupportsFiles && (
                  <InfoBanner
                    text={
                      hasCuratorRole(user)
                        ? t('file_upload_disabled_curator_can_upload_on_behalf')
                        : t('file_upload_disabled_due_to_institution_policy')
                    }
                  />
                )}

                {canUploadFile && (
                  <FileUploader
                    uppy={uppy}
                    addFile={(file) => {
                      const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(
                        associatedArtifactIsNullArtifact
                      );
                      if (nullAssociatedArtifactIndex > -1) {
                        remove(nullAssociatedArtifactIndex);
                      }
                      push(file);
                    }}
                  />
                )}

                {pendingFiles.length > 0 && (
                  <FileList
                    title={t('registration.files_and_license.files_in_progress')}
                    files={pendingFiles}
                    uppy={uppy}
                    remove={remove}
                    baseFieldName={name}
                  />
                )}

                {completedFiles.length > 0 && (
                  <FileList
                    title={t('registration.files_and_license.files_completed')}
                    files={completedFiles}
                    uppy={uppy}
                    remove={remove}
                    baseFieldName={name}
                  />
                )}
              </Paper>

              <Paper elevation={0} component={BackgroundDiv}>
                <Typography variant="h2" sx={{ mb: '1rem' }}>
                  {t('common.links')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {values.doi && <LinkField fieldName={FileFieldNames.Doi} label={t('common.doi')} />}

                  {(values.entityDescription?.reference?.doi || !values.doi) && (
                    <LinkField
                      fieldName={ResourceFieldNames.Doi}
                      label={t('registration.registration.link_to_resource')}
                      canEdit={canEditFilesAndLinks}
                    />
                  )}

                  {associatedArtifacts.map((link, index) => {
                    if (link.type !== 'AssociatedLink') {
                      return null;
                    }
                    return (
                      <LinkField
                        key={index}
                        fieldName={`${FileFieldNames.AssociatedArtifacts}[${index}].${SpecificLinkFieldNames.Id}`}
                        label={getAssociatedLinkRelationTitle(t, link.relation)}
                        canEdit={canEditFilesAndLinks}
                        handleDelete={canEditFilesAndLinks ? () => remove(index) : undefined}
                      />
                    );
                  })}
                </Box>
              </Paper>
            </>
          )}

          {(associatedArtifacts.length === 0 || isNullAssociatedArtifact) && !originalDoi && !values.doi && (
            <Paper elevation={0} component={BackgroundDiv}>
              <Typography variant="h2" sx={{ mb: '1rem' }}>
                {t('registration.files_and_license.resource_is_a_reference')}
              </Typography>
              <Box sx={{ backgroundColor: 'white', width: '100%', p: '0.25rem 1rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox data-testid={dataTestId.registrationWizard.files.nullAssociatedArtifactCheckbox} />
                  }
                  checked={isNullAssociatedArtifact}
                  onChange={(_, checked) => {
                    if (!checked) {
                      const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(
                        associatedArtifactIsNullArtifact
                      );
                      if (nullAssociatedArtifactIndex > -1) {
                        remove(nullAssociatedArtifactIndex);
                      }
                    }

                    if (associatedArtifacts.length === 0 && checked) {
                      const nullAssociatedArtifact: NullAssociatedArtifact = { type: 'NullAssociatedArtifact' };
                      push(nullAssociatedArtifact);
                    }
                  }}
                  label={t('registration.files_and_license.resource_has_no_files_or_links')}
                />
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </FieldArray>
  );
};
