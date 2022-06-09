import { Box, ButtonBase, styled, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';

enum WorkflowValue {
  RegistratorPublishesMetadataOnly,
  RegistratorPublishesMetadataAndFiles,
  RegistratorCannotPublish,
}

const StyledAccessRight = styled('div')({
  display: 'flex',
  gap: '0.5rem',
});

const StyledAccessRightsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginBottom: '0.5rem',
});

interface PublishStrategySettingsProps {
  isSelected: boolean;
}

const WorkflowButton = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== 'isSelected' })(
  ({ isSelected }: PublishStrategySettingsProps) => ({
    padding: '0.5rem',
    border: '1px solid',
    borderRadius: '0.5rem',
    opacity: isSelected ? 1 : 0.5,
  })
);

export const PublishStrategySettings = () => {
  const [value, setValue] = useState(WorkflowValue.RegistratorPublishesMetadataOnly);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '35rem' }}>
      <WorkflowButton
        isSelected={value === WorkflowValue.RegistratorPublishesMetadataAndFiles}
        onClick={() => setValue(WorkflowValue.RegistratorPublishesMetadataAndFiles)}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator publiserer uten godkjenning fra Kurator
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Metadata</Typography>
            </StyledAccessRight>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Filer og lisenser</Typography>
            </StyledAccessRight>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>Institutsjonen bestemmer hvem som er Registrator.</Typography>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        isSelected={value === WorkflowValue.RegistratorPublishesMetadataOnly}
        onClick={() => setValue(WorkflowValue.RegistratorPublishesMetadataOnly)}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator publiserer uten godkjenning fra Kurator
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Metadata</Typography>
            </StyledAccessRight>
            <Typography>Filer og lisenser</Typography>
          </StyledAccessRightsContainer>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        isSelected={value === WorkflowValue.RegistratorCannotPublish}
        onClick={() => setValue(WorkflowValue.RegistratorCannotPublish)}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator kan kun registrere
          </Typography>
          <StyledAccessRightsContainer>
            <Typography>Metadata</Typography>
            <Typography>Filer og lisenser</Typography>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>
            Metadata, filer og lisenser må godkjennes av Kurator før publisering.
          </Typography>
        </Box>
      </WorkflowButton>
    </Box>
  );
};
