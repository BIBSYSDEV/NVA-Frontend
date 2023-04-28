import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
      defaultExpanded
      heading={t('registration.files_and_license.files_count', { count: publishableFilesLength })}>
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
