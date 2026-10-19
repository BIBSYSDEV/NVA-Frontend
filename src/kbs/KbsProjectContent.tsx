import { ReactNode } from 'react';
import { StyledPageContent } from '../components/styled/Wrappers';
import { useKbsReport } from './_hooks/useKbsReport';
import { canSeeKbsPanel } from './_utils/kbs-role-helpers';
import { KbsActionPanel } from './kbs-action-panel/KbsActionPanel';
import { KbsRole } from './kbs-action-panel/kbs.types';
import { KbsProjectLayout } from './KbsProjectLayout';

// TODO: Let the preview controls choose the role
const role: KbsRole = KbsRole.ProjectLeader;

interface KbsProjectContentProps {
  children: ReactNode;
}

export const KbsProjectContent = ({ children }: KbsProjectContentProps) => {
  const kbsReport = useKbsReport();

  return canSeeKbsPanel(role, kbsReport.status) ? (
    <KbsProjectLayout main={children} sidebar={<KbsActionPanel role={role} kbsReport={kbsReport} />} />
  ) : (
    <StyledPageContent>{children}</StyledPageContent>
  );
};
