import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

interface NavigationListAccordionProps extends AccordionProps {
  title: string;
  startIcon: ReactNode;
  accordionPath: string;
  defaultPath?: string;
  dataTestId: string;
  expanded?: boolean;
}

export const NavigationListAccordion = ({
  title,
  startIcon,
  accordionPath,
  defaultPath = accordionPath,
  expanded,
  dataTestId,
  children,
  ...props
}: NavigationListAccordionProps) => {
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const isExpanded = expanded !== undefined ? expanded : currentPath.startsWith(accordionPath);

  return (
    <Accordion
      {...props}
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
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            'svg, div': { borderRadius: '50%', height: '25px', width: '25px' },
            svg: { padding: '0.2rem' },
          }}>
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
