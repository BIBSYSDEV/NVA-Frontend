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

  const hasFilesAwaitingApproval = registration.associatedArtifacts.some((file) => file.type === 'UnpublishedFile');

  const associatedFiles = getAssociatedFiles(registration.associatedArtifacts);
  const hasPublishableFiles = associatedFiles.some(
    (file) => file.type === 'PublishedFile' || file.type === 'UnpublishedFile'
  );
  const filesToShow = associatedFiles.filter((file) => userIsRegistrationAdmin || file.type === 'PublishedFile');

  const showFileVersionField = isTypeWithFileVersionField(
    registration.entityDescription?.reference?.publicationInstance?.type
  );

  return !hasPublishableFiles ? null : (
    <LandingPageAccordion
      dataTestId={dataTestId.registrationLandingPage.filesAccordion}
      defaultExpanded
      heading={
        hasFilesAwaitingApproval
          ? t('registration.files_and_license.files_awaits_approval')
          : t('registration.files_and_license.files')
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
  );
};
