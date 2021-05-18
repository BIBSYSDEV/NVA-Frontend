import { Divider, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core';
import { Autocomplete, Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { useFetch } from '../../utils/hooks/useFetch';

interface Facet {
  id: string;
  engName: string;
  norName: string;
  count: number;
}

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

  const coordinatinInstitutions = Object.entries(healthProjects?.facets.institution_coordinating_idfacet ?? []).map(
    ([key, value]) => {
      const keys = key.split('##');
      const f: Facet = { id: keys[0], norName: keys[1], engName: keys[2], count: value as number };
      return f;
    }
  );

  const responsibleInstitutions = Object.entries(healthProjects?.facets.institution_responsible_idfacet ?? []).map(
    ([key, value]) => {
      const keys = key.split('##');
      const f: Facet = { id: keys[0], norName: keys[1], engName: keys[2], count: value as number };
      return f;
    }
  );

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
    const institution_responsible_idfacets = webParams.getAll('institution_responsible_idfacet');
    if (institution_responsible_idfacets) {
      institution_responsible_idfacets.forEach((element) => {
        apiParams.append('fq', `institution_responsible_idfacet:${element}*`);
      });
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
          <Autocomplete
            options={coordinatinInstitutions}
            getOptionLabel={(option) => `${option.norName} (${option.count})`}
            getOptionSelected={(option, value) => option.id === value.id}
            onChange={(_, value) => {
              if (value?.id) {
                searchParams.set('institution_coordinating_idfacet', value.id);
              } else {
                searchParams.delete('institution_coordinating_idfacet');
              }
              history.push({ search: searchParams.toString() });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="registration-tag-field"
                label="Koordinerende Institusjon"
                variant="filled"
                fullWidth
              />
            )}
          />

          <Autocomplete
            options={responsibleInstitutions}
            multiple
            getOptionLabel={(option) => `${option.norName} (${option.count})`}
            onChange={(_, value) => {
              searchParams.delete('institution_responsible_idfacet');
              if (value) {
                const ids = value.map((val) => val.id);
                ids.forEach((id) => {
                  searchParams.append('institution_responsible_idfacet', id);
                });
              }
              history.push({ search: searchParams.toString() });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="registration-tag-field"
                label="Ansvarlig Institusjoner"
                variant="filled"
                fullWidth
              />
            )}
          />
          <Divider />
          <Typography variant="h3">{hitsCount} treff:</Typography>
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
