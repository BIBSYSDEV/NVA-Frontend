import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CristinProjectType from '../../../types/cristin_project.types';
import { searchCristinProjects } from '../../../api/cristinProjectApi';
import { useDispatch } from 'react-redux';
import { Field, Form } from 'formik';
import { PublisherSearch } from '../references/PublisherSearch';

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

const Project: React.FC = () => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState('');
  const [idValue, setIdValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const [projectList, setProjectList] = useState<CristinProjectType[]>();
  const [selectedProjectList, setSelectedProjectList] = useState<CristinProjectType[]>([]);

  const handleProjectSearch = async () => {
    let projects = [];
    projects = await searchCristinProjects(`title=${titleValue}`, dispatch);
    setSearchTerm(titleValue);
    console.log(projects);
    projects ? setProjectList(projects) : setProjectList([]);
    setTitleValue('');
    setIdValue('');
  };

  //
  // const handleListItemClick = (event: any, project: CristinProjectType) => {
  //   setSelectedProjectList([...selectedProjectList, project]);
  //   setProjectList(undefined);
  // };
  //
  // const removeProject = (projectToDelete: CristinProjectType) => {
  //   setSelectedProjectList(selectedProjectList.filter(project => projectToDelete !== project));
  // };

  //                                    {`${project.title[project.main_language]}(${project.main_language})`}
  return (
    <StyledCristinProject>
      <div>{t('resource_form.search_project')}</div>
    </StyledCristinProject>
  );
};

export default Project;
