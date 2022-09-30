import { Box, Skeleton, Button, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../../../utils/urlPaths';

interface RelatedResourceRowRowProps {
  uri: string;
  removeRelatedResource: () => void;
}

export const RelatedResourceRow = ({ uri, removeRelatedResource }: RelatedResourceRowRowProps) => {
  const { t } = useTranslation();
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: isInternalRegistration ? uri : '' });
  const [confirmRemoveRelation, setConfirmRemoveRelation] = useState(false);

  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : (
        <>
          {isInternalRegistration ? (
            <Link component={RouterLink} to={getRegistrationLandingPagePath(registration?.identifier ?? '')}>
              {getTitleString(registration?.entityDescription?.mainTitle)}
            </Link>
          ) : (
            <Link href={uri}>{uri}</Link>
          )}
          <Button
            size="small"
            variant="outlined"
            sx={{ ml: '1rem' }}
            color="error"
            onClick={() => setConfirmRemoveRelation(true)}
            startIcon={<RemoveCircleOutlineIcon />}>
            {t('registration.resource_type.research_data.remove_relation')}
          </Button>
        </>
      )}
      <ConfirmDialog
        open={confirmRemoveRelation}
        title={t('registration.resource_type.research_data.remove_relation')}
        onAccept={removeRelatedResource}
        onCancel={() => setConfirmRemoveRelation(false)}>
        <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
      </ConfirmDialog>
    </Box>
  );
};
