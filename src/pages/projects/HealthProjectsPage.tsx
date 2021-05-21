import { List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core';
import { Autocomplete, Pagination } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { useFetch } from '../../utils/hooks/useFetch';

interface FacetsResponse {
  facets: {
    type: FacetData;
  };
}

interface Result {
  title_english: string;
  title_norwegian: string;
  unit_name_english: string[];
  unit_name_bokmal: string[];
}

interface FacetData {
  [key: string]: number;
}

interface HealthResponse {
  'total-count': number;
  results: Result[];
  facets: {
    [name: string]: FacetData;
  };
}

interface FacetObject {
  id: string;
  engName: string;
  norName: string;
  count: number;
}

const rowsPerPage = 10;
const apiQueryParamKey = 'fq';
const typeKey = 'type';

const apiBaseUrl = 'https://app.cristin.no/ws/ajax/getHealth';
const apiBaseSearchParam = `?facet.field.empty=infrastructure_category_idfacet&facet=on&&sort=score%20desc&rows=${rowsPerPage}`;

const facetFields = {
  project: [
    'health_project_type_idfacet',
    'category_idfacet',
    'institution_coordinating_idfacet',
    'institution_responsible_idfacet',
    'hrcs_category_idfacet',
    'hrcs_activity_idfacet',
    'infrastructure_category_idfacet',
  ],
  infrastructure: ['institution_idfacet', 'category_idfacet', 'infrastructure_material_idfacet'],
};

const getFacets = (values: FacetData) => {
  const facetsEntries = Object.entries(values);
  const facets = facetsEntries.map(([key, value]) => {
    const keys = key.split('##');
    const facet: FacetObject = { id: keys[0], norName: keys[1], engName: keys[2], count: value };
    return facet;
  });
  return facets;
};

const HealthProjectsPage = () => {
  const { t } = useTranslation('health');
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [apiUrl, setApiUrl] = useState<URL>();
  const searchParams = new URLSearchParams(history.location.search);

  const [typeOverview] = useFetch<FacetsResponse>(`${apiBaseUrl}?facet.field=type&facet=on&rows=1`);
  const [healthProjects] = useFetch<HealthResponse>(apiUrl ? apiUrl.toString() : '');

  const types = useMemo(
    () => (typeOverview ? Object.entries(typeOverview.facets.type).map(([name, count]) => ({ name, count })) : []),
    [typeOverview]
  );

  const filters = healthProjects
    ? Object.entries(healthProjects.facets).map(([key, values]) => ({ key, values: getFacets(values) }))
    : [];

  useEffect(() => {
    const webParams = new URLSearchParams(history.location.search);
    const apiParams = new URLSearchParams(apiBaseSearchParam);
    apiParams.delete(apiQueryParamKey);

    apiParams.set('page', page.toString());

    if (types.length > 0) {
      const typeParam = webParams.get(typeKey) ?? types[0].name;
      apiParams.append(apiQueryParamKey, `type:${typeParam}`);

      const facets = typeParam === 'infrastructure' ? facetFields.infrastructure : facetFields.project;

      for (const facet of facets) {
        apiParams.append('facet.field', facet);
      }
    }

    for (const [key, value] of webParams.entries()) {
      apiParams.append(apiQueryParamKey, `${key}:${value}*`);
    }

    const newApiUrl = new URL(`${apiBaseUrl}?${apiParams.toString()}`);
    setApiUrl(newApiUrl);
  }, [history.location.search, page, types]);

  const hitsCount = healthProjects ? healthProjects['total-count'] : 0;

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">{t('project')}</PageHeader>
      {healthProjects && (
        <>
          <Autocomplete
            options={types}
            value={types.find((t) => t.name === searchParams.get(typeKey)) ?? types[0]}
            getOptionLabel={(option) => `${t(option.name)} (${option.count})`}
            onChange={(_, value) => {
              const newSearchParams = new URLSearchParams();
              if (value?.name && value.name !== types[0].name) {
                newSearchParams.set(typeKey, value.name);
              }
              history.push({ search: newSearchParams.toString() });
            }}
            renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}
          />
          {filters.map((filter) => (
            <Autocomplete
              key={filter.key}
              options={filter.values}
              value={filter.values.find((i) => i.id === searchParams.get(filter.key)) ?? null}
              getOptionLabel={(option) => `${option.norName} (${option.count})`}
              getOptionSelected={(option, value) => option.id === value?.id}
              onChange={(_, value) => {
                if (value?.id) {
                  searchParams.set(filter.key, value.id);
                } else {
                  searchParams.delete(filter.key);
                }
                history.push({ search: searchParams.toString() });
              }}
              renderInput={(params) => <TextField {...params} label={t(filter.key)} variant="filled" />}
            />
          ))}

          <Typography variant="h3">{hitsCount} treff:</Typography>
          <List>
            {healthProjects.results.map((result, index) => (
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
