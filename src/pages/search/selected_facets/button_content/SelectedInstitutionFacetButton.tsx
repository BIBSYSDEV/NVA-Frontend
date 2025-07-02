import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganizationByIdentifier } from '../../../../api/hooks/useFetchOrganizationByIdentifier';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SelectedInstitutionFacetButtonProps {
  institutionIdentifier: string;
}

export const SelectedInstitutionFacetButton = ({ institutionIdentifier }: SelectedInstitutionFacetButtonProps) => {
  const { t } = useTranslation();

  const organizationQuery = useFetchOrganizationByIdentifier(institutionIdentifier);
  const institutionName = getLanguageString(organizationQuery.data?.labels) || t('common.unknown');

  return organizationQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : institutionName;
};
