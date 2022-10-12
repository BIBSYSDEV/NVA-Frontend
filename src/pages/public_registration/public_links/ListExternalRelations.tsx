import { Typography, List, ListItem, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PublicExternalRelationsProps {
  links?: string[];
}

export const ListExternalRelations = ({ links = [] }: PublicExternalRelationsProps) => {
  const { t } = useTranslation();

  return links.length === 0 ? (
    <Typography>{t('registration.resource_type.research_data.no_external_links')}</Typography>
  ) : (
    <List>
      {links.map((link) => (
        <ListItem key={link}>
          <Link href={link}>{link}</Link>
        </ListItem>
      ))}
    </List>
  );
};
