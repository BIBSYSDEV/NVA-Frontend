import { Grid, Link as MuiLink, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getDuplicateCheckPagePath } from '../../../../utils/urlPaths';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { ExpandedImportCandidate } from '../../../../types/importCandidate.types';

interface CentralImportResultItemProps {
  importCandidate: ExpandedImportCandidate;
}

export const CentralImportResultItem = ({ importCandidate }: CentralImportResultItemProps) => {
  const { t } = useTranslation();

  const verifiedContributorCount = importCandidate.totalVerifiedContributors;
  const contributorsCount = importCandidate.totalContributors;

  const allContributorInstitutions = importCandidate.organizations?.map(
    (affiliation) => affiliation.labels && getLanguageString(affiliation.labels)
  );
  const institutions = allContributorInstitutions ? [...new Set(allContributorInstitutions.flat())] : [];
  const publicationInstanceType = importCandidate?.publicationInstance.type;

  return (
    <ListItem divider data-testid={`${dataTestId.basicData.centralImport.resultItem}-${importCandidate.id}`}>
      <ListItemText disableTypography>
        <Grid container spacing={2} justifyContent="space-between" alignItems="baseline">
          <Grid item md={2} xs={12}>
            {publicationInstanceType && (
              <Typography>{t(`registration.publication_types.${publicationInstanceType}`)}</Typography>
            )}
          </Grid>
          <Grid item md={5} xs={12}>
            {importCandidate.doi && (
              <MuiLink underline="hover" href={importCandidate.doi} target="_blank" rel="noopener noreferrer">
                <Typography gutterBottom variant="body2" sx={{ color: 'primary.main', wordBreak: 'break-word' }}>
                  {importCandidate.doi}
                </Typography>
              </MuiLink>
            )}
            {importCandidate.mainTitle && (
              <Typography
                gutterBottom
                sx={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  wordBreak: 'break-word',
                }}>
                <MuiLink component={Link} to={`${getDuplicateCheckPagePath(importCandidate.id)}`}>
                  {importCandidate.mainTitle}
                </MuiLink>
              </Typography>
            )}
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>
              {t('basic_data.central_import.verified_contributor_count', {
                verifiedContributorCount,
                contributorsCount,
              })}
            </Typography>
          </Grid>
          <Grid item md={3} xs={12}>
            {institutions && <Typography variant="body1">{institutions.join('; ')}</Typography>}
          </Grid>
        </Grid>
      </ListItemText>
    </ListItem>
  );
};
