import { ReactNode } from 'react';
import { StyledPageContent } from '../components/styled/Wrappers';
import { useKbsPreviewRole } from './_hooks/useKbsPreviewRole';
import { useKbsReport } from './_hooks/useKbsReport';
import { canSeeKbsPanel } from './_utils/kbs-role-helpers';
import { KbsActionPanel } from './kbs-action-panel/KbsActionPanel';
import { KbsPreviewControls } from './KbsPreviewControls';
import { KbsProjectLayout } from './KbsProjectLayout';

interface KbsProjectContentProps {
  projectId: string;
  children: ReactNode;
}

export const KbsProjectContent = ({ projectId, children }: KbsProjectContentProps) => {
  const [role, setRole] = useKbsPreviewRole();
  const kbsReport = useKbsReport(projectId);

  return (
    <>
      {canSeeKbsPanel(role, kbsReport.status) ? (
        <KbsProjectLayout main={children} sidebar={<KbsActionPanel role={role} kbsReport={kbsReport} />} />
      ) : (
        <StyledPageContent>{children}</StyledPageContent>
      )}
      <KbsPreviewControls role={role} onRoleChange={setRole} kbsReport={kbsReport} />
    </>
  );
};
