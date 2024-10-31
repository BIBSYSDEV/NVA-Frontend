import { List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RelatedDocument } from '../../../types/registration.types';
import { ShowRelatedRegistrationUris } from './ShowRelatedRegistrationUris';

interface ShowRelatedDocumentsProps {
  related: RelatedDocument[];
}

export const ShowRelatedDocuments = ({ related }: ShowRelatedDocumentsProps) => {
  const { t } = useTranslation();

  return related
    ?.sort((a, b) => (a.sequence && b.sequence ? a.sequence - b.sequence : 0))
    .map((document, index) => {
      return document.type === 'ConfirmedDocument' ? (
        <ShowRelatedRegistrationUris
          links={[document.identifier]}
          loadingLabel={t('registration.resource_type.related_results')}
        />
      ) : (
        <List disablePadding>
          <ListItem key={index} disableGutters>
            {document.text}
          </ListItem>
        </List>
      );
    });
};
