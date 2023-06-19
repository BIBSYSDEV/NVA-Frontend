import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NavigationListAccordionProps extends AccordionProps {
  title: string;
  startIcon: ReactNode;
  accordionPath: string;
  defaultPath: string;
  dataTestId: string;
}

export const NavigationListAccordion = ({
  title,
  startIcon,
  accordionPath,
  defaultPath,
  dataTestId,
  children,
}: NavigationListAccordionProps) => {
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const isExpanded = currentPath.startsWith(accordionPath);

  return (
    <Accordion
      data-testid={dataTestId}
      disableGutters
      expanded={isExpanded}
      elevation={0}
      sx={{
        mb: '0.5rem',
        bgcolor: 'secondary.dark',
      }}>
      <AccordionSummary
        sx={{ paddingX: '0.75rem' }}
        expandIcon={!isExpanded ? <ExpandMoreIcon /> : null}
        onClick={() => !isExpanded && history.push(defaultPath)}>
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', svg: { borderRadius: '50%' } }}>
          {startIcon}
          <Typography variant="h2" fontWeight={500}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};
