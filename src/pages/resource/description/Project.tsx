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
  background-color: ${({ theme }) => theme.palette.background.default};
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
  const [searchTerm, setSearchTerm] = useState('');

  const [projectList, setProjectList] = useState<CristinProjectType[]>();
  const [selectedProjectList, setSelectedProjectList] = useState<CristinProjectType[]>([]);

  const handleProjectSearch = async () => {
    let projects = [];
    if (idValue) {
      projects = await searchCristinProjects(`id=${idValue}`);
      setSearchTerm(idValue);
    } else if (titleValue) {
      projects = await searchCristinProjects(`title=${titleValue}`);
      setSearchTerm(titleValue);
    }
    projects ? setProjectList(projects) : setProjectList([]);
    setTitleValue('');
    setIdValue('');
  };

  const handleTitleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const handleIdValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdValue(event.target.value);
  };

  const handleListItemClick = (event: any, project: CristinProjectType) => {
    setSelectedProjectList([...selectedProjectList, project]);
    setProjectList(undefined);
  };

  const removeProject = (projectToDelete: CristinProjectType) => {
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
                <a href={'/'}>{`${project.title[project.main_language]}(${project.main_language})`}</a>
                <StyledDeleteIcon onClick={() => removeProject(project)} />
              </ListItem>
            ))}
          </List>
        </StyledSelectedProjectList>
      ) : (
        <div>{t('resource_form.no_projects')}</div>
      )}

      <div>{t('resource_form.search_project')}</div>
      <StyledInputBox>
        <StyledMuiTextField
          onChange={handleTitleValueChange}
          margin="dense"
          variant="outlined"
          name="title"
          label={t('resource_form.project_title')}
          value={titleValue}
        />
        <StyledMuiTextField
          onChange={handleIdValueChange}
          margin="dense"
          name="id"
          variant="outlined"
          label={t('resource_form.project_id')}
          value={idValue}
        />
        <Button disabled={!titleValue && !idValue} color="primary" variant="contained" onClick={handleProjectSearch}>
          {t('publication_panel.search')}
        </Button>
      </StyledInputBox>
      {projectList && (
        <StyledResultBox>
          {t('resource_form.project_search_result_header', {
            searchTerm: searchTerm,
            count: projectList.length,
          })}
          <StyledResultListBox>
            <List>
              {projectList.map((project: CristinProjectType, index: number) => (
                <ListItem button onClick={event => handleListItemClick(event, project)} key={index}>
                  {`${project.title[project.main_language]}(${project.main_language})`}
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
