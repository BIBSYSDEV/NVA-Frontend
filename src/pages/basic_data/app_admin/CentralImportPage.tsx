import { Divider, Grid, Link, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../utils/hooks/useFetch';
import { Registration } from '../../../types/registration.types';
import { SearchApiPath } from '../../../api/apiPaths';
import { SearchResponse } from '../../../types/common.types';
import { ListSkeleton } from '../../../components/ListSkeleton';

interface ResultItemProps {
  publication: Registration;
}

const ResultItem = ({ publication }: ResultItemProps) => {
  return (
    <>
      <ListItem>
        <ListItemText disableTypography>
          <Grid container spacing={2} justifyContent="space-between" alignItems="baseline">
            <Grid item md={2} xs={12}>
              <Typography variant="body1">{publication.type}</Typography>
            </Grid>
            <Grid item md={5} xs={12}>
              <Link underline="hover" href={publication.doi} target="_blank" rel="noopener noreferrer">
                <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                  {publication.doi}
                </Typography>
              </Link>
              <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
                {publication.entityDescription?.mainTitle}
              </Typography>
              {/*{publication.contributors.map((contributor: any, index: number) => (*/}
              {/*  <Typography display="inline" variant="body2" key={index}>*/}
              {/*    {contributor}*/}
              {/*    {'; '}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">({/*publication.confirmedContributors*/})</Typography>
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography variant="body1">{/*publication.institution*/}</Typography>
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Divider sx={{ my: '1rem', borderWidth: 1 }} />
    </>
  );
};

export const CentralImportPage = () => {
  const { t } = useTranslation('basicData');

  const [results, isLoadingResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}"`,
    errorMessage: t('feedback:error.search'),
  });
  const publications = results?.hits ?? [];
  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('Publikasjoner')}
      </Typography>
      {isLoadingResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        publications && (
          <>
            {results?.size}
            <List>
              {publications.map((publication, index) => (
                <ResultItem publication={publication} key={index} />
              ))}
            </List>
          </>
        )
      )}
    </>
  );
};
