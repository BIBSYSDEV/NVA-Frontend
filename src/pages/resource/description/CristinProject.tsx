import { Button, TextField as MuiTextField } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getCristinProjects } from '../../../api/cristinProject';

const StyledCristinProject = styled.div`
  margin: 1rem;
`;

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledFieldHeader = styled.header`
  font-size: 1.5rem;
`;

const StyledMuiTextField = styled(MuiTextField)`
  margin-right: 1rem;
`;

const CristinProject: React.FC = () => {
  const { t } = useTranslation();
  const [queryValue, setQueryValue] = useState('');
  //const [projectList, setProjectList] = useState([]);

  const handleProjectSearch = async () => {
    const per = await getCristinProjects(queryValue);
    console.log(per);
    //setProjectList();
  };

  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValue(event.target.value);
  };

  return (
    <StyledCristinProject>
      <StyledFieldHeader>{t('resource_form.project_assosiation')}</StyledFieldHeader>
      <StyledInputBox>
        <StyledMuiTextField
          onChange={handleSearchValueChange}
          margin="dense"
          variant="outlined"
          label={t('resource_form.project')}
        />
        <Button color="primary" variant="contained" onClick={handleProjectSearch}>
          {t('publication_panel.search')}
        </Button>
      </StyledInputBox>
    </StyledCristinProject>
  );
};

export default CristinProject;
