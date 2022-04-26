import { Grid, Link, ListItem, ListItemText, Typography } from '@mui/material';
import { Registration } from '../../../types/registration.types';
import { useTranslation } from 'react-i18next';
import { getLanguageString } from '../../../utils/translation-helpers';

interface CentralImportResultItemProps {
  publication: Registration;
}

export const CentralImportResultItem = ({ publication }: CentralImportResultItemProps) => {
  const { t } = useTranslation('publicationTypes');

  const contributors = publication.entityDescription?.contributors ?? [];
  const verifiedContributorCount = contributors.filter((contributor) => !!contributor.identity.id).length;
  const contributorsCount = contributors.length;

  const allContributorInstitutions = publication.entityDescription?.contributors.map((contributor) =>
    contributor.affiliations?.map((affiliation) => affiliation.labels && getLanguageString(affiliation.labels))
  );
  const institutions = new Set(allContributorInstitutions?.flat() ?? []);

  const publicationInstanceType = publication.entityDescription?.reference?.publicationInstance.type ?? '';

  return (
    <ListItem divider>
      <ListItemText disableTypography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="baseline">
          <Grid item md={2} xs={12}>
            {publicationInstanceType && <Typography variant="body1">{t(publicationInstanceType)}</Typography>}
          </Grid>
          <Grid item md={5} xs={12}>
            {publication.entityDescription?.reference?.doi && (
              <Link
                underline="hover"
                href={publication.entityDescription.reference.doi}
                target="_blank"
                rel="noopener noreferrer">
                <Typography gutterBottom variant="body2" sx={{ color: 'primary.dark', wordBreak: 'break-word' }}>
                  {publication.entityDescription.reference.doi}
                </Typography>
              </Link>
            )}
            {publication.entityDescription?.mainTitle && (
              <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
                {publication.entityDescription.mainTitle}
              </Typography>
            )}
            {publication.entityDescription?.contributors && (
              <Typography display="inline" variant="body2">
                {publication.entityDescription.contributors.map((contributor) => contributor.identity.name).join('; ')}
              </Typography>
            )}
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography variant="body1">
              {t('basicData:verifiedContributorCount', { verifiedContributorCount, contributorsCount })}
            </Typography>
          </Grid>
          <Grid item md={3} xs={12}>
            {institutions && <Typography variant="body1">{Array.from(institutions).join(', ')}</Typography>}
          </Grid>
        </Grid>
      </ListItemText>
    </ListItem>
  );
};
