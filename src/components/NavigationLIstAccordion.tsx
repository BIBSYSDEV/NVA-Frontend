import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NavigationListAccordionProps extends AccordionProps {
  title: string;
  startIcon: ReactNode;
  accordionPath: string;
  defaultPath: string;
}

export const NavigationListAccordion = ({
  title,
  startIcon,
  accordionPath,
  defaultPath,
  children,
}: NavigationListAccordionProps) => {
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  return (
    <Accordion
      disableGutters
      expanded={currentPath.startsWith(accordionPath)}
      elevation={0}
      sx={{
        mb: '0.5rem',
        ':last-child': {
          mt: '0.5rem',
        },
        '&.MuiAccordion-root.Mui-expanded': {
          mt: 0,
          mb: '0.5rem',
        },
        bgcolor: 'secondary.dark',
      }}>
      <AccordionSummary
        sx={{ paddingX: '0.5rem' }}
        expandIcon={<ExpandMoreIcon />}
        onClick={() => !currentPath.startsWith(accordionPath) && history.push(defaultPath)}>
        <Box sx={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {startIcon}
          <Typography variant="h3" fontWeight={500}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingTop: 0, paddingX: '0.5rem' }}>{children}</AccordionDetails>
    </Accordion>
  );
};
