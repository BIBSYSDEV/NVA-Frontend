import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, SvgIconProps, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { HorizontalBox } from '../../../components/styled/Wrappers';

interface CreateProjectAccordionProps {
  headline: string;
  description?: string;
  icon: ReactElement<SvgIconProps>;
  children: ReactNode;
  testId: string;
}

export const CreateProjectAccordion = ({
  headline,
  description,
  icon,
  testId,
  children,
}: CreateProjectAccordionProps) => {
  return (
    <Accordion data-testid={testId} elevation={3} sx={{ bgcolor: 'background.default' }}>
      <AccordionSummary
        sx={{ px: '1.25rem', py: '0.75rem' }}
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.dark', height: '2.5rem', width: '2.5rem' }} />}>
        <HorizontalBox>
          {icon}
          <div>
            <Typography sx={{ fontWeight: 'bold', pb: '0.25rem' }}>{headline}</Typography>
            {description && <Typography>{description}</Typography>}
          </div>
        </HorizontalBox>
      </AccordionSummary>
      <AccordionDetails sx={{ px: '1.25rem' }}>{children}</AccordionDetails>
    </Accordion>
  );
};
