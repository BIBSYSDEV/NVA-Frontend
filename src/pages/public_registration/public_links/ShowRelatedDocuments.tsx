import { List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmedDocument, RelatedDocument, UnconfirmedDocument } from '../../../types/registration.types';
import { ShowRelatedRegistrationUris } from './ShowRelatedRegistrationUris';

interface ShowRelatedDocumentsProps {
  related: RelatedDocument[];
}

export const ShowRelatedDocuments = ({ related }: ShowRelatedDocumentsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {related.some((document) => document.type === 'ConfirmedDocument') && (
        <ShowRelatedRegistrationUris
          links={related
            ?.filter((document) => document.type === 'ConfirmedDocument')
            .map((document) => (document as ConfirmedDocument).identifier)}
          loadingLabel={t('registration.resource_type.related_results')}
        />
      )}

      {related.some((document) => document.type === 'UnconfirmedDocument') && (
        <List disablePadding>
          {related
            ?.filter((document) => document.type === 'UnconfirmedDocument')
            .map((document) => <ListItem disableGutters>{(document as UnconfirmedDocument).text}</ListItem>)}
        </List>
      )}
    </>
  );
};
