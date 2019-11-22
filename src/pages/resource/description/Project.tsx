import { Button, ListItem, List, TextField as MuiTextField } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CristinProjectType from '../../../types/cristin_project.types';
import DeleteIcon from '@material-ui/icons/Delete';
import { searchCristinProjects } from '../../../api/cristinProject';

const StyledCristinProject = styled.div`
  margin: 0.5rem;
  padding-bottom: 1rem;
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

const StyledResultBox = styled.div`
  background-color: white;
  border: 1px solid grey;
  padding: 1rem;
`;

const StyledSelectedProjectList = styled.div`
  padding: 1rem;
`;

const StyledResultListBox = styled.div`
  padding: 0.4rem;
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  color: red;
`;

const Project: React.FC = () => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState('');
  const [idValue, setIdValue] = useState('');
  const [projectList, setProjectList] = useState<CristinProjectType[]>([]);
  const [selectedProjectList, setSelectedProjectList] = useState<CristinProjectType[]>([]);

  const handleProjectSearch = async () => {
    let projects = [];
    if (idValue) {
      projects = await searchCristinProjects(`id=${idValue}`);
    } else if (titleValue) {
      projects = await searchCristinProjects(`title=${titleValue}`);
    }
    setProjectList(projects);
  };

  const handleTitleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };
  const handleIdValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdValue(event.target.value);
  };

  const handleListItemClick = (event: any, project: CristinProjectType) => {
    setSelectedProjectList([...selectedProjectList, project]);
    setProjectList([]);
    setTitleValue('');
    setIdValue('');
  };

  const deleteProject = (projectToDelete: CristinProjectType) => {
    setSelectedProjectList(selectedProjectList.filter(project => projectToDelete !== project));
  };

  return (
    <StyledCristinProject>
      <StyledFieldHeader>{t('resource_form.project_assosiation')}</StyledFieldHeader>
      {selectedProjectList.length > 0 ? (
        <StyledSelectedProjectList>
          <List>
            {selectedProjectList.map((project: CristinProjectType, index: number) => (
              <ListItem key={index}>
                <a href={'/'}>{project.main_language === 'no' && `${project.title.no} (NO)`}</a>
                <a href={'/'}>{project.main_language === 'en' && `${project.title.en} (EN)`}</a>
                <StyledDeleteIcon onClick={() => deleteProject(project)} />
              </ListItem>
            ))}
          </List>
        </StyledSelectedProjectList>
      ) : (
        <div>Ingen prosjekter tilknyttet</div>
      )}

      <div>Søk etter prosjekt:</div>
      <StyledInputBox>
        <StyledMuiTextField
          onChange={handleTitleValueChange}
          margin="dense"
          variant="outlined"
          name="title"
          label={t('resource_form.project')}
          value={titleValue}
        />
        <StyledMuiTextField
          onChange={handleIdValueChange}
          margin="dense"
          name="id"
          variant="outlined"
          label={t('resource_form.id')}
          value={idValue}
        />
        <Button disabled={!titleValue && !idValue} color="primary" variant="contained" onClick={handleProjectSearch}>
          {t('publication_panel.search')}
        </Button>
      </StyledInputBox>
      {projectList.length > 0 && (
        <StyledResultBox>
          Searching for "{titleValue}
          {idValue}" gives {projectList.length} hits:
          <StyledResultListBox>
            <List>
              {projectList.map((project: CristinProjectType, index: number) => (
                <ListItem button onClick={event => handleListItemClick(event, project)} key={index}>
                  {project.main_language === 'no' && `${project.title.no} (NO)`}
                  {project.main_language === 'en' && `${project.title.en} (EN)`}
                </ListItem>
              ))}
            </List>
          </StyledResultListBox>
        </StyledResultBox>
      )}
    </StyledCristinProject>
  );
};

export default Project;
