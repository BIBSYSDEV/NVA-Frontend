import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
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
        onClick={() => {
          if (!isExpanded) {
            navigate(defaultPath);

            if (!isMobile) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }}>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            'svg, img, div': { borderRadius: '50%', height: '25px', width: '25px' },
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
