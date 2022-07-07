import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { userIsOwnerOfRegistration, userIsCuratorForRegistration } from '../../../utils/registration-helpers';
import { PublicRegistrationContentProps } from '../PublicRegistrationContent';
import { FileRow } from './FileRow';

const maxFileSizeForPreview = 10_000_000; //10 MB

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootState) => store.user);
  const files = registration.fileSet?.files ?? [];

  const userIsOwner = userIsOwnerOfRegistration(user, registration);
  const userIsCurator = userIsCuratorForRegistration(user, registration);
  const userIsRegistrationAdmin = userIsOwner || userIsCurator;

  const showFilesAreAwaitingApprovalHeading =
    files.some((file) => file.type === 'UnpublishedFile') && userIsRegistrationAdmin;
  const filesToShow = files.filter(
    (file) => !file.administrativeAgreement && (file.type === 'PublishedFile' || userIsRegistrationAdmin)
  );
  return (
    <LandingPageAccordion
      data-testid={dataTestId.registrationLandingPage.filesAccordion}
      defaultExpanded
      heading={
        showFilesAreAwaitingApprovalHeading
          ? t('files_and_license.files_awaits_approval')
          : t('files_and_license.files')
      }>
      <>
        {filesToShow.map((file, index) => (
          <FileRow
            key={file.identifier}
            file={file}
            registrationIdentifier={registration.identifier}
            openPreviewByDefault={index === 0 && filesToShow[0].size < maxFileSizeForPreview}
          />
        ))}
      </>
    </LandingPageAccordion>
  );
};
