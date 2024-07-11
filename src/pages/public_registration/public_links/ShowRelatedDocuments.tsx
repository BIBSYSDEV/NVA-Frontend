import { List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmedDocument, RelatedDocument, UnconfirmedDocument } from '../../../types/registration.types';
import { ShowRelatedRegistrationUris } from './ShowRelatedRegistrationUris';

interface ShowRelatedDocumentsProps {
  related: RelatedDocument[];
}

export const ShowRelatedDocuments = ({ related }: ShowRelatedDocumentsProps) => {
  const { t } = useTranslation();

  const confirmedDocuments = related
    .filter((document) => document.type === 'ConfirmedDocument')
    .map((document) => (document as ConfirmedDocument).identifier);

  const unconfirmedDocuments = related
    .filter((document) => document.type === 'UnconfirmedDocument')
    .map((document) => (document as UnconfirmedDocument).text);

  return (
    <>
      {confirmedDocuments.length > 0 && (
        <ShowRelatedRegistrationUris
          links={confirmedDocuments}
          loadingLabel={t('registration.resource_type.related_results')}
        />
      )}

      {unconfirmedDocuments.length > 0 && (
        <List disablePadding>
          {unconfirmedDocuments.map((text, index) => (
            <ListItem key={index} disableGutters>
              {text}
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
