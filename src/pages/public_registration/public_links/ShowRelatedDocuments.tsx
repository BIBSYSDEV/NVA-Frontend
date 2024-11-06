import { List, ListItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RelatedDocument } from '../../../types/registration.types';
import { ShowRelatedRegistrationUris } from './ShowRelatedRegistrationUris';

interface ShowRelatedDocumentsProps {
  related: RelatedDocument[];
}

export const ShowRelatedDocuments = ({ related }: ShowRelatedDocumentsProps) => {
  const { t } = useTranslation();

  if (related.length === 0) {
    return null;
  }

  return (
    <List>
      {related
        .sort((a, b) => (a.sequence && b.sequence ? a.sequence - b.sequence : 0))
        .map((document, index) => (
          <ListItem key={index} disableGutters>
            {document.type === 'ConfirmedDocument' ? (
              <ShowRelatedRegistrationUris
                links={[document.identifier]}
                loadingLabel={t('registration.resource_type.related_results')}
              />
            ) : (
              <Typography>{document.text}</Typography>
            )}
          </ListItem>
        ))}
    </List>
  );
};
