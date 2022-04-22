import { Divider, Grid, Link, ListItem, ListItemText, Typography } from '@mui/material';
import { Registration } from '../../../types/registration.types';
import { useTranslation } from 'react-i18next';
import { getLanguageString } from '../../../utils/translation-helpers';

interface CentralImportResultItemProps {
  publication: Registration;
}

export const CentralImportResultItem = ({ publication }: CentralImportResultItemProps) => {
  const { t } = useTranslation('publicationTypes');
  const numberOfVerifiedContributors =
    publication.entityDescription?.contributors.filter((contributor) => !!contributor.identity.id).length ?? 0;
  const numberOfContributors = publication.entityDescription?.contributors.length ?? 0;
  const allContributorInstitutions = publication.entityDescription?.contributors.map((contributor) =>
    contributor.affiliations?.map(
      (affiliation) => (affiliation.labels && getLanguageString(affiliation.labels)) ?? null
    )
  );
  const institutions = new Set(allContributorInstitutions?.flat() ?? []);
  //debugger;
  return (
    <>
      <ListItem>
        <ListItemText disableTypography>
          <Grid container spacing={2} justifyContent="space-between" alignItems="baseline">
            <Grid item md={2} xs={12}>
              {publication.entityDescription?.reference?.publicationInstance.type && (
                <Typography variant="body1">
                  {t(publication.entityDescription?.reference?.publicationInstance.type ?? '')}
                </Typography>
              )}
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
              <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
                {publication.entityDescription?.mainTitle}
              </Typography>
              {publication.entityDescription?.contributors && (
                <Typography display="inline" variant="body2">
                  {publication.entityDescription.contributors
                    .map((contributor, index) => contributor.identity.name)
                    .join('; ')}
                </Typography>
              )}
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">
                ({numberOfVerifiedContributors} {t('common:of')} {numberOfContributors})
              </Typography>
            </Grid>
            <Grid item md={3} xs={12}>
              {institutions && <Typography variant="body1">{Array.from(institutions).join(', ')}</Typography>}
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Divider sx={{ my: '1rem', borderWidth: 1 }} />
    </>
  );
};
