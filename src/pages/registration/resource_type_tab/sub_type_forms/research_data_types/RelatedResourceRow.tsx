import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, Link, ListItem, Skeleton, Typography } from '@mui/material';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { RegistrationListItemContent } from '../../../../../components/RegistrationList';
import { SearchListContainer } from '../../../../../components/styled/Wrappers';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { convertToRegistrationSearchItem } from '../../../../../utils/registration-helpers';

interface RelatedResourceRowProps {
  uri: string;
  removeRelatedResource: () => void;
}

export const RelatedResourceRow = ({ uri, removeRelatedResource }: RelatedResourceRowProps) => {
  const { t } = useTranslation();
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({
    url: isInternalRegistration ? uri : '',
  });
  const [confirmRemoveRelation, setConfirmRemoveRelation] = useState(false);

  return (
    <ListItem disablePadding>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : isInternalRegistration && registration ? (
        <SearchListContainer sx={{ borderLeftColor: 'registration.main', width: '100%' }}>
          <RegistrationListItemContent
            registration={convertToRegistrationSearchItem(registration)}
            onRemoveRelated={() => setConfirmRemoveRelation(true)}
          />
        </SearchListContainer>
      ) : (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Link data-testid={dataTestId.registrationWizard.resourceType.externalLink} href={uri}>
            {uri}
          </Link>
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(uri)}
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
