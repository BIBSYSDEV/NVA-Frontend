import { Divider, Grid, Link, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const mockPublication = {
  title: 'The Title',
  description: 'The Description',
  type: 'Article',
  doi: 'https://doi.org/10.1038/s41467-021-25342423',
  contributors: ['Peder Botten', 'Gregor Garbrielsen', 'Oddny Osteloff'],
  institution: 'The Institution',
  confirmedContributors: '0 of 2',
};

const mockPublicationList = [
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
];

interface ResultItemProps {
  publication: any;
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
                {publication.title}
              </Typography>
              {publication.contributors.map((contributor: any, index: number) => (
                <Typography display="inline" variant="body2" key={index}>
                  {contributor}
                  {'; '}
                </Typography>
              ))}
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography variant="body1">({publication.confirmedContributors})</Typography>
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography variant="body1">{publication.institution}</Typography>
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
  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('Publikasjoner')}
      </Typography>
      <List>
        {mockPublicationList.map((publication, index) => (
          <ResultItem publication={publication} key={index} />
        ))}
      </List>
    </>
  );
};
