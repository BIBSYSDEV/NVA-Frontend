import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, MuiThemeProvider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import lightTheme from '../../themes/lightTheme';

const StyledProjectChip = styled(Chip)`
  margin: 0.25rem;
  background: #ff8888;
`;

const PublicProjectsContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('registration:description.project_association')}
      </Typography>

      <MuiThemeProvider theme={lightTheme}>
        {registration.projects.map((project) => (
          <StyledProjectChip
            key={project.id}
            label={
              <Typography>
                {project.name}
                {project.grants && project.grants.length > 0 && (
                  <span>
                    {' '}
                    ({t('description.financed_by')}: {project.grants.map((grant) => grant.source).join(', ')})
                  </span>
                )}
              </Typography>
            }
          />
        ))}
      </MuiThemeProvider>
    </>
  );
};

export default PublicProjectsContent;
