import { Grid, Link as MuiLink, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { getDuplicateCheckPagePath } from '../../../../utils/urlPaths';

interface CentralImportResultItemProps {
  publication: Registration;
}

export const CentralImportResultItem = ({ publication }: CentralImportResultItemProps) => {
  const { t } = useTranslation('publicationTypes');

  const contributors = publication.entityDescription?.contributors ?? [];
  const verifiedContributorCount = contributors.filter((contributor) => !!contributor.identity.id).length;
  const contributorsCount = contributors.length;

  const allContributorInstitutions = contributors.map((contributor) =>
    contributor.affiliations?.map((affiliation) => affiliation.labels && getLanguageString(affiliation.labels))
  );
  const institutions = new Set(allContributorInstitutions?.flat() ?? []);

  const publicationInstanceType = publication.entityDescription?.reference?.publicationInstance.type ?? '';

  return (
    <ListItem divider data-testid={`${dataTestId.basicData.centralImport.resultItem}-${publication.identifier}`}>
      <ListItemText disableTypography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="baseline">
          <Grid item md={2} xs={12}>
            {publicationInstanceType && <Typography variant="body1">{t(publicationInstanceType)}</Typography>}
          </Grid>
          <Grid item md={5} xs={12}>
            {publication.entityDescription?.reference?.doi && (
              <MuiLink
                underline="hover"
                href={publication.entityDescription.reference.doi}
                target="_blank"
                rel="noopener noreferrer">
                <Typography gutterBottom variant="body2" sx={{ color: 'primary.dark', wordBreak: 'break-word' }}>
                  {publication.entityDescription.reference.doi}
                </Typography>
              </MuiLink>
            )}
            {publication.entityDescription?.mainTitle && (
              <Typography
                gutterBottom
                sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic', wordBreak: 'break-word' }}>
                <MuiLink component={Link} to={`${getDuplicateCheckPagePath(publication.identifier)}`}>
                  {publication.entityDescription.mainTitle}
                </MuiLink>
              </Typography>
            )}
            {contributors && (
              <Typography display="inline" variant="body2">
                {contributors.map((contributor) => contributor.identity.name).join('; ')}
              </Typography>
            )}
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography variant="body1">
              {t('basicData:central_import.verifiedContributorCount', { verifiedContributorCount, contributorsCount })}
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
