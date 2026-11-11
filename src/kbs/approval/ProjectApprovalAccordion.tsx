import { Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ApprovalIdentifiers } from './_components/ApprovalIdentifiers';
import { useProjectApproval } from './_hooks/useProjectApproval';

interface ProjectApprovalAccordionProps {
  projectId: string;
}

export const ProjectApprovalAccordion = ({ projectId }: ProjectApprovalAccordionProps) => {
  const { t } = useTranslation();
  const { data: approval } = useProjectApproval(projectId);

  if (!approval) {
    return null;
  }

  return (
    <LandingPageAccordion heading={`${t('approval')} (1)`} dataTestId="project-approval-accordion">
      <Link href={approval.handle} target="_blank" rel="noopener noreferrer">
        <Typography variant="subtitle1" component="span">
          {approval.title}
        </Typography>
      </Link>
      <ApprovalIdentifiers identifiers={approval.identifiers} />
    </LandingPageAccordion>
  );
};
