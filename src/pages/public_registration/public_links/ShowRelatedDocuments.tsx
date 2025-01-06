import { Box, List, ListItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RelatedDocument } from '../../../types/registration.types';
import { ShowRelatedRegistrationUris } from './ShowRelatedRegistrationUris';

interface ShowRelatedDocumentsProps {
  related: RelatedDocument[];
}

export const ShowRelatedDocuments = ({ related }: ShowRelatedDocumentsProps) => {
  const { t } = useTranslation();

  const filteredRelated = related.filter(
    (document) =>
      (document.type === 'ConfirmedDocument' && document.identifier) ||
      (document.type === 'UnconfirmedDocument' && document.text)
  );

  if (filteredRelated.length === 0) {
    return null;
  }

  return (
    <List>
      {filteredRelated
        .sort((a, b) => (a.sequence && b.sequence ? a.sequence - b.sequence : 0))
        .map((document, index) => (
          <ListItem key={index} disablePadding>
            {document.type === 'ConfirmedDocument' ? (
              <ShowRelatedRegistrationUris
                links={[document.identifier]}
                loadingLabel={t('registration.resource_type.related_results')}
              />
            ) : (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'secondary.dark',
                  background: 'white',
                  minHeight: '3rem',
                  width: '100%',
                  p: '1rem',
                }}>
                <Typography fontWeight="bold">{document.text}</Typography>
              </Box>
            )}
          </ListItem>
        ))}
    </List>
  );
};
