import { Divider, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { useFetch } from '../../utils/hooks/useFetch';

const StyledSearch = styled.div`
  width: 85%;
  justify-items: center;
`;

const url = new URL(
  'https://app.cristin.no/ws/ajax/getHealth?facet.field=health_project_type_idfacet&facet.field=category_idfacet&facet.field=institution_coordinating_idfacet&facet.field=institution_responsible_idfacet&facet.field=hrcs_category_idfacet&facet.field=hrcs_activity_idfacet&facet.field=infrastructure_category_idfacet&facet.field.empty=infrastructure_category_idfacet&facet=on&&fq=type:project&sort=score%20desc&page=1&rows=10'
);

const HealthProjectsPage = () => {
  const history = useHistory();
  const [apiUrl, setApiUrl] = useState(url);
  const searchParams = new URLSearchParams(history.location.search);

  const [healthProjects] = useFetch<any>(apiUrl.toString());

  useEffect(() => {
    const webParams = new URLSearchParams(history.location.search);
    const apiParams = apiUrl.searchParams;
    apiParams.delete('fq');
    apiParams.append('fq', 'type:project');
    const institution_coordinating_idfacet = webParams.get('institution_coordinating_idfacet');
    if (institution_coordinating_idfacet) {
      apiParams.append('fq', `institution_coordinating_idfacet:${institution_coordinating_idfacet}*`);
    }
    const newUrl = new URL(`https://app.cristin.no/ws/ajax/getHealth?${apiParams.toString()}`);
    setApiUrl(newUrl);
  }, [history.location.search]);

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader backPath="/">Helseprosjekt</PageHeader>
      {healthProjects && (
        <>
          <Typography>Koordinerende Institusjon</Typography>
          {Object.entries(healthProjects.facets.institution_coordinating_idfacet)
            .slice(0, 5)
            .map(([key, value]) => {
              const keyValues = key.split('##');

              return (
                <Typography
                  key={key}
                  onClick={() => {
                    searchParams.set('institution_coordinating_idfacet', keyValues[0]);
                    history.push({ search: searchParams.toString() });
                  }}>
                  {keyValues[1]} : {value}
                </Typography>
              );
            })}
          <Divider />
          {healthProjects.results.map((result: any, index: number) => (
            <Typography key={index}>
              {result.title_norwegian} ({result.unit_name_bokmal[0]})
            </Typography>
          ))}
        </>
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default HealthProjectsPage;
