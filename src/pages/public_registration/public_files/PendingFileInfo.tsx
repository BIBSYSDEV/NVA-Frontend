import { Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { getFullCristinName } from '../../../utils/user-helpers';
import { PendingFilesInfo } from './PendingFilesInfo';

interface PendingFileDetailsProps {
  uploadedBy: string;
}

export const PendingFileDetails = ({ uploadedBy }: PendingFileDetailsProps) => {
  const { t } = useTranslation();
  const userQuery = useFetchUserQuery(uploadedBy);

  const personQuery = useFetchPerson(userQuery.data?.cristinId ?? '');
  const organizationQuery = useFetchOrganization(userQuery.data?.institutionCristinId ?? '');

  const fullName = getFullCristinName(personQuery.data?.names);
  const organizationName = organizationQuery.data?.acronym;
  const uploader = [fullName, organizationName].filter(Boolean).join(', ');

  const isPending = userQuery.isPending || personQuery.isPending || organizationQuery.isPending;

  return (
    <PendingFilesInfo
      aria-busy={isPending}
      aria-live="polite"
      text={
        <>
          <Typography>{t('registration.public_page.files.file_awaits_approval')}</Typography>
          {isPending ? (
            <Skeleton sx={{ width: '15rem' }} />
          ) : (
            <Typography>{t('registration.public_page.files.uploaded_by', { uploader })}</Typography>
          )}
        </>
      }
    />
  );
};
