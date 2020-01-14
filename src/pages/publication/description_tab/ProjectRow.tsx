import React, { FC } from 'react';
import styled from 'styled-components';
import { Project } from '../../../types/project.types';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';

const StyledRow = styled.div`
  margin-top: 1rem;
  background: white;
  padding: 1rem;
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'titleLabel  grantIdLabel    financedByLabel .'
    'title       grantId         financedBy      removeButton';
  grid-template-columns: 4fr 2fr 2fr 1fr;
`;

const StyledTitleLabel = styled.div`
  font-weight: bold;
  grid-area: titleLabel;
`;

const StyledTitle = styled.div`
  grid-area: title;
`;

const StyledGrantLabel = styled.div`
  font-weight: bold;
  grid-area: grantIdLabel;
`;

const StyledGrant = styled.div`
  grid-area: grantId;
`;

const StyledFinancedByLabel = styled.div`
  font-weight: bold;
  grid-area: financedByLabel;
`;

const StyledFinancedBy = styled.div`
  grid-area: financedBy;
`;

const StyledAction = styled.div`
  grid-area: removeButton;
`;

const StyledRemoveButton = styled(Button)`
  background-color: red;
  color: white;
`;

interface ProjectRowProps {
  project: Project;
  onClickRemove: () => void;
}

const ProjectRow: FC<ProjectRowProps> = ({ project, onClickRemove }) => {
  const { t } = useTranslation();

  return (
    <StyledRow>
      <StyledTitleLabel>{t('common:title')}</StyledTitleLabel>
      <StyledTitle>{project.titles[0]?.title}</StyledTitle>
      <>
        <StyledGrantLabel>{t('publication:description.project_id')}</StyledGrantLabel>
        <StyledGrant>{project.fundings?.[0]?.projectCode}</StyledGrant>

        <StyledFinancedByLabel>{t('publication:description.financed_by')}</StyledFinancedByLabel>
        <StyledFinancedBy>{project.fundings?.[0]?.fundingSourceCode}</StyledFinancedBy>
      </>
      <StyledAction>
        <StyledRemoveButton onClick={onClickRemove}>
          <DeleteIcon />
          {t('common:remove')}
        </StyledRemoveButton>
      </StyledAction>
    </StyledRow>
  );
};

export default ProjectRow;
