import { Box, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchApprovalByIdentifier } from '../../../../api/hooks/useFetchApprovalByIdentifier';
import { ApprovalSearch } from '../../../../components/approval-search/ApprovalSearch';
import { ProjectApprovalItem } from '../../../../components/project-approval-item/ProjectApprovalItem';
import { Approval } from '../../../../types/approval.types';
import { CristinProject, SaveCristinProject } from '../../../../types/project.types';
import { toNewProjectApproval } from '../../../../utils/approval-helpers';
import { dataTestId } from '../../../../utils/dataTestIds';

const approvalsFieldName = 'approvals';

/* Approvals can only be sent when the project is created, so they are read-only when editing a project */
export const RelatedApprovalField = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<SaveCristinProject | CristinProject>();
  const isNewProject = !('id' in values);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h2">{t('related_approval')}</Typography>
      {isNewProject ? (
        <>
          <Typography>{t('related_approval_description')}</Typography>
          <NewProjectApprovalSearch />
        </>
      ) : (
        <>
          <Typography>{t('approvals_cannot_be_changed')}</Typography>
          {values.approvals?.map((approval) => (
            <ProjectApprovalItem key={`${approval.authority}-${approval.identifier}`} approval={approval} />
          ))}
        </>
      )}
    </Box>
  );
};

const NewProjectApprovalSearch = () => {
  const { values, setFieldValue } = useFormikContext<SaveCristinProject>();
  const approvalQuery = useFetchApprovalByIdentifier(values.approvals?.[0]?.identifier);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const changeApproval = (approval: Approval | null) => {
    setSelectedApproval(approval);
    const projectApproval = approval ? toNewProjectApproval(approval) : null;
    setFieldValue(approvalsFieldName, projectApproval ? [projectApproval] : []);
  };

  return (
    <ApprovalSearch
      selectedApproval={selectedApproval ?? approvalQuery.data ?? null}
      onChange={changeApproval}
      dataTestId={dataTestId.projectForm.relatedApprovalSearchField}
    />
  );
};
