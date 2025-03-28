import { Skeleton, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { getFullCristinName } from '../../../utils/user-helpers';
import { PendingFilesInfo } from './PendingFilesInfo';

interface PendingFileDetailsProps {
  uploadedBy: string;
}

export const PendingFileDetails = ({ uploadedBy }: PendingFileDetailsProps) => {
  const userQuery = useFetchUserQuery(uploadedBy);

  const personQuery = useFetchPerson(userQuery.data?.cristinId ?? '');
  const organizationQuery = useFetchOrganization(userQuery.data?.institutionCristinId ?? '');

  const fullName = getFullCristinName(personQuery.data?.names);
  const organizationName = organizationQuery.data?.acronym;

  const uploader = [fullName, organizationName].filter(Boolean).join(', ');

  const isLoadingData = userQuery.isPending || personQuery.isPending || organizationQuery.isPending;

  return (
    <PendingFilesInfo
      aria-busy={isLoadingData}
      aria-live="polite"
      text={
        isLoadingData ? (
          <>
            <Skeleton sx={{ width: '10rem' }} />
            <Skeleton sx={{ width: '15rem' }} />
          </>
        ) : (
          <Trans
            i18nKey="registration.public_page.files.file_awaits_approval"
            values={{ uploader }}
            components={{ p: <Typography /> }}
          />
        )
      }
    />
  );
};
