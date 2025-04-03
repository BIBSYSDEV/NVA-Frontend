import { Skeleton, Typography, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { ImportUploadDetails, UserUploadDetails } from '../../../types/associatedArtifact.types';
import { getFullCristinName } from '../../../utils/user-helpers';

interface PendingFileDetailsProps extends TypographyProps {
  uploadDetails?: UserUploadDetails | ImportUploadDetails;
}

export const FileUploaderInfo = ({ uploadDetails, ...typographyProps }: PendingFileDetailsProps) => {
  return uploadDetails?.type === 'UserUploadDetails' ? (
    <UserUploaderInfo uploadDetails={uploadDetails} {...typographyProps} />
  ) : uploadDetails?.type === 'ImportUploadDetails' ? (
    <ImportUploaderInfo uploadDetails={uploadDetails} {...typographyProps} />
  ) : null;
};

interface UserUploaderInfoProps extends TypographyProps {
  uploadDetails: UserUploadDetails;
}

const UserUploaderInfo = ({ uploadDetails, ...typographyProps }: UserUploaderInfoProps) => {
  const { t } = useTranslation();
  const userQuery = useFetchUserQuery(uploadDetails.uploadedBy, { staleTime: Infinity, gcTime: 1_800_000 });

  const personQuery = useFetchPerson(userQuery.data?.cristinId ?? '', { staleTime: Infinity, gcTime: 1_800_000 });
  const organizationQuery = useFetchOrganization(userQuery.data?.institutionCristinId ?? '');

  const fullName = getFullCristinName(personQuery.data?.names);
  const organizationName = organizationQuery.data?.acronym;
  const uploader = [fullName, organizationName].filter(Boolean).join(', ');

  const isPending =
    (userQuery.isPending && !userQuery.isError) ||
    (userQuery.data && (personQuery.isFetching || organizationQuery.isFetching));

  if (!isPending && !uploader) {
    return null;
  }

  return (
    <div aria-busy={isPending} aria-live="polite">
      {isPending ? (
        <Skeleton sx={{ width: '15rem' }} />
      ) : (
        <Typography {...typographyProps}>{t('registration.public_page.files.uploaded_by', { uploader })}</Typography>
      )}
    </div>
  );
};

interface ImportUploaderInfoProps extends TypographyProps {
  uploadDetails: ImportUploadDetails;
}

const ImportUploaderInfo = ({ uploadDetails, ...typographyProps }: ImportUploaderInfoProps) => {
  const { t } = useTranslation();
  const { source, archive } = uploadDetails;

  return source && archive ? (
    <Typography {...typographyProps}>{t('log.imported_from_source_and_archive', { source, archive })}</Typography>
  ) : uploadDetails.source ? (
    <Typography {...typographyProps}>{t('log.imported_from_source', source)}</Typography>
  ) : null;
};
