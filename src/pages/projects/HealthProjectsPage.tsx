import { Button, Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { useFetch } from '../../utils/hooks/useFetch';

const url = new URL(
  'https://app.cristin.no/ws/ajax/getHealth?facet.field=health_project_type_idfacet&facet.field=category_idfacet&facet.field=institution_coordinating_idfacet&facet.field=institution_responsible_idfacet&facet.field=hrcs_category_idfacet&facet.field=hrcs_activity_idfacet&facet.field=infrastructure_category_idfacet&facet.field.empty=infrastructure_category_idfacet&facet=on&&fq=type:project&sort=score%20desc&page=1&rows=10'
);

const rowsPerPage = 10;

const HealthProjectsPage = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [apiUrl, setApiUrl] = useState(url);
  const searchParams = new URLSearchParams(history.location.search);

  const [healthProjects] = useFetch<any>(apiUrl.toString());

  useEffect(() => {
    apiUrl.searchParams.set('page', page.toString());
    const newUrl = new URL(`https://app.cristin.no/ws/ajax/getHealth${apiUrl.search}`);
    setApiUrl(newUrl);
  }, [page]);

  useEffect(() => {
    const webParams = new URLSearchParams(history.location.search);
    const apiParams = apiUrl.searchParams;
    apiParams.delete('fq');
    apiParams.append('fq', 'type:project');
    const institution_coordinating_idfacet = webParams.get('institution_coordinating_idfacet');
    if (institution_coordinating_idfacet) {
      apiParams.append('fq', `institution_coordinating_idfacet:${institution_coordinating_idfacet}*`);
    }
    const institution_responsible_idfacet = webParams.get('institution_responsible_idfacet');
    if (institution_responsible_idfacet) {
      // TODO: can have multiple values...
      apiParams.append('fq', `institution_responsible_idfacet:${institution_responsible_idfacet}*`);
    }
    const newUrl = new URL(`https://app.cristin.no/ws/ajax/getHealth?${apiParams.toString()}`);
    setApiUrl(newUrl);
  }, [history.location.search]);

  const hitsCount = healthProjects ? healthProjects['total-count'] : 0;
  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">Helseprosjekt</PageHeader>
      {healthProjects && (
        <>
          <Typography variant="h2">Koordinerende Institusjon</Typography>
          {Object.entries(healthProjects.facets.institution_coordinating_idfacet)
            .slice(0, 5)
            .map(([key, value]) => {
              const keyValues = key.split('##');

              return (
                <Button
                  key={key}
                  onClick={() => {
                    searchParams.set('institution_coordinating_idfacet', keyValues[0]);
                    history.push({ search: searchParams.toString() });
                  }}>
                  {keyValues[1]} ({value})
                </Button>
              );
            })}
          <Typography variant="h2">Forskningsansvarlig Institusjon</Typography>
          {Object.entries(healthProjects.facets.institution_responsible_idfacet)
            .slice(0, 5)
            .map(([key, value]) => {
              const keyValues = key.split('##');

              return (
                <Button
                  key={key}
                  onClick={() => {
                    searchParams.set('institution_responsible_idfacet', keyValues[0]);
                    history.push({ search: searchParams.toString() });
                  }}>
                  {keyValues[1]} ({value})
                </Button>
              );
            })}
          <Divider />
          <Typography variant="h3">{hitsCount} treff</Typography>
          <List>
            {healthProjects.results.map((result: any, index: number) => (
              <ListItem divider key={index}>
                <ListItemText disableTypography>
                  <Typography>{result.title_norwegian}</Typography>
                  <Typography variant="body2" gutterBottom>
                    {result.unit_name_bokmal[0]}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Pagination
            variant="outlined"
            color="primary"
            size="large"
            shape="rounded"
            onChange={(_, newPage) => setPage(newPage)}
            page={page}
            count={Math.ceil(hitsCount / rowsPerPage)}
          />
        </>
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default HealthProjectsPage;
