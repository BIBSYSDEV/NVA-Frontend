import React, { FC } from 'react';
import styled from 'styled-components';
import { Project } from '../../../types/project.types';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';

const StyledCard = styled(Card)`
  margin-top: 1rem;
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

interface ProjectRowProps {
  project: Project;
  onClickRemove: () => void;
  dataTestId: string;
}

const ProjectRow: FC<ProjectRowProps> = ({ project, onClickRemove, dataTestId }) => {
  const { t } = useTranslation();

  return (
    <StyledCard data-testid={dataTestId}>
      <StyledTitleLabel>{t('common:title')}</StyledTitleLabel>
      <StyledTitle>{project.name}</StyledTitle>
      <>
        <StyledGrantLabel>{t('publication:description.project_id')}</StyledGrantLabel>
        <StyledGrant>{project.grants?.[0]?.id}</StyledGrant>

        <StyledFinancedByLabel>{t('publication:description.financed_by')}</StyledFinancedByLabel>
        <StyledFinancedBy>{project.grants?.[0]?.source}</StyledFinancedBy>
      </>
      <StyledAction>
        <Button data-testid={`${dataTestId}_remove_button`} color="secondary" onClick={onClickRemove}>
          <DeleteIcon />
          {t('common:remove')}
        </Button>
      </StyledAction>
    </StyledCard>
  );
};

export default ProjectRow;
