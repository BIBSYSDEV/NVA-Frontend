import { Divider, Grid, Link, ListItem, ListItemText, Typography } from '@mui/material';
import { Registration } from '../../../types/registration.types';

interface CentralImportResultItemProps {
  publication: Registration;
}

export const CentralImportResultItem = ({ publication }: CentralImportResultItemProps) => {
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
