import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { RootState } from '../../../redux/store';
import { RegistrationStatus } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userIsOwnerOfRegistration, userIsCuratorForRegistration } from '../../../utils/registration-helpers';
import { PublicRegistrationContentProps } from '../PublicRegistrationContent';
import { FileRow } from './FileRow';

const maxFileSizeForPreview = 10_000_000; //10 MB

export const FilesLandingPageAccordion = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const files = registration.fileSet?.files ?? [];

  const userIsOwner = userIsOwnerOfRegistration(user, registration);
  const userIsCurator = userIsCuratorForRegistration(user, registration);
  const userIsRegistrationAdmin = userIsOwner || userIsCurator;

  const showRegistrationHasFilesAwaitingApproval =
    registration.status === RegistrationStatus.Published &&
    userIsRegistrationAdmin &&
    files.some((file) => file.type === 'UnpublishedFile');

  const filesToShow = files.filter(
    (file) => file.type === 'PublishedFile' || (file.type === 'UnpublishedFile' && userIsRegistrationAdmin)
  );

  return filesToShow.length === 0 ? null : (
    <LandingPageAccordion
      dataTestId={dataTestId.registrationLandingPage.filesAccordion}
      defaultExpanded
      heading={
        showRegistrationHasFilesAwaitingApproval ? (
          <Box component="span" sx={{ bgcolor: 'secondary.light', p: '0.25rem' }}>
            {t('registration.files_and_license.files_awaits_approval')}
          </Box>
        ) : (
          t('registration.files_and_license.files')
        )
      }>
      {filesToShow.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationIdentifier={registration.identifier}
          openPreviewByDefault={index === 0 && file.size < maxFileSizeForPreview}
        />
      ))}
    </LandingPageAccordion>
  );
};
