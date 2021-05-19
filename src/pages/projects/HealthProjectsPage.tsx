import { List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core';
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

const apiQueryParamKey = 'fq';
const coordinatingInstitutionKey = 'institution_coordinating_idfacet';
const responsibleInstitutionKey = 'institution_responsible_idfacet';

const apiBaseUrl = 'https://app.cristin.no/ws/ajax/getHealth';
const apiBaseSearchParam =
  '?facet.field=health_project_type_idfacet&facet.field=category_idfacet&facet.field=institution_coordinating_idfacet&facet.field=institution_responsible_idfacet&facet.field=hrcs_category_idfacet&facet.field=hrcs_activity_idfacet&facet.field=infrastructure_category_idfacet&facet.field.empty=infrastructure_category_idfacet&facet=on&&fq=type:project&sort=score%20desc&page=1&rows=10';

const rowsPerPage = 10;

const getFacets = (values: any[]) => {
  const facets = values.map(([key, value]) => {
    const keys = key.split('##');
    const facet: Facet = { id: keys[0], norName: keys[1], engName: keys[2], count: value as number };
    return facet;
  });
  return facets;
};

const HealthProjectsPage = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [apiUrl, setApiUrl] = useState<URL>();
  const searchParams = new URLSearchParams(history.location.search);

  const [healthProjects] = useFetch<any>(apiUrl ? apiUrl.toString() : '');
  const coordinatingInstitutions = getFacets(
    Object.entries(healthProjects?.facets.institution_coordinating_idfacet ?? [])
  );
  const responsibleInstitutions = getFacets(
    Object.entries(healthProjects?.facets.institution_responsible_idfacet ?? [])
  );

  useEffect(() => {
    const webParams = new URLSearchParams(history.location.search);
    const apiParams = new URLSearchParams(apiBaseSearchParam);
    apiParams.delete(apiQueryParamKey);
    apiParams.append(apiQueryParamKey, 'type:project');
    const coordinatingInstitutionId = webParams.get(coordinatingInstitutionKey);
    if (coordinatingInstitutionId) {
      apiParams.append(apiQueryParamKey, `${coordinatingInstitutionKey}:${coordinatingInstitutionId}*`);
    }
    const responsibleInstitutionIds = webParams.getAll(responsibleInstitutionKey);
    if (responsibleInstitutionIds) {
      responsibleInstitutionIds.forEach((id) => {
        apiParams.append(apiQueryParamKey, `${responsibleInstitutionKey}:${id}*`);
      });
    }
    apiParams.set('page', page.toString());

    const newApiUrl = new URL(`${apiBaseUrl}?${apiParams.toString()}`);
    setApiUrl(newApiUrl);
  }, [history.location.search, page]);

  const hitsCount = healthProjects ? healthProjects['total-count'] : 0;

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">Helseprosjekt</PageHeader>
      {healthProjects && (
        <>
          <Autocomplete
            options={coordinatingInstitutions}
            value={coordinatingInstitutions.find((i) => i.id === searchParams.get(coordinatingInstitutionKey)) ?? null}
            getOptionLabel={(option) => `${option.norName} (${option.count})`}
            getOptionSelected={(option, value) => option.id === value?.id}
            onChange={(_, value) => {
              if (value?.id) {
                searchParams.set(coordinatingInstitutionKey, value.id);
              } else {
                searchParams.delete(coordinatingInstitutionKey);
              }
              history.push({ search: searchParams.toString() });
            }}
            renderInput={(params) => <TextField {...params} label="Koordinerende Institusjon" variant="filled" />}
          />

          <Autocomplete
            options={responsibleInstitutions}
            value={responsibleInstitutions.filter((a) => searchParams.getAll(responsibleInstitutionKey).includes(a.id))}
            multiple
            getOptionLabel={(option) => `${option.norName} (${option.count})`}
            onChange={(_, value) => {
              searchParams.delete(responsibleInstitutionKey);
              if (value) {
                const ids = value.map((val) => val.id);
                ids.forEach((id) => {
                  searchParams.append(responsibleInstitutionKey, id);
                });
              }
              history.push({ search: searchParams.toString() });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Ansvarlig Institusjoner" variant="filled" margin="normal" />
            )}
          />
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
