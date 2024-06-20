import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, Link, ListItem, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
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
    <ListItem disableGutters>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: '0.25rem 1rem',
          }}>
          {isInternalRegistration ? (
            <Link
              data-testid={dataTestId.registrationWizard.resourceType.relatedRegistrationLink(
                registration?.identifier ?? ''
              )}
              component={RouterLink}
              to={getRegistrationLandingPagePath(registration?.identifier ?? '')}>
              {getTitleString(registration?.entityDescription?.mainTitle)}
            </Link>
          ) : (
            <Link data-testid={dataTestId.registrationWizard.resourceType.externalLink} href={uri}>
              {uri}
            </Link>
          )}
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(
              registration?.identifier ?? ''
            )}
            onClick={() => setConfirmRemoveRelation(true)}
            startIcon={<RemoveCircleOutlineIcon />}>
            {t('registration.resource_type.research_data.remove_relation')}
          </Button>
        </Box>
      )}
      <ConfirmDialog
        open={confirmRemoveRelation}
        title={t('registration.resource_type.research_data.remove_relation')}
        onAccept={removeRelatedResource}
        onCancel={() => setConfirmRemoveRelation(false)}>
        <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
      </ConfirmDialog>
    </ListItem>
  );
};
