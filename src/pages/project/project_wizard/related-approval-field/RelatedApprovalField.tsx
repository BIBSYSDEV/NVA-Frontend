import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchApprovalByIdentifier } from '../../../../api/hooks/useFetchApprovalByIdentifier';
import { ApprovalSearch } from '../../../../components/approval-search/ApprovalSearch';
import { ProjectApprovalList } from '../../../../components/project-approval-list/ProjectApprovalList';
import { Approval } from '../../../../types/approval.types';
import { CristinProject, SaveCristinProject } from '../../../../types/project.types';
import { getApprovedApprovals, toNewProjectApproval } from '../../../../utils/approval-helpers';
import { dataTestId } from '../../../../utils/dataTestIds';
import { isSavedProject } from '../../../registration/description_tab/projects_field/projectHelpers';
import { FormBox } from '../styles';
import { createFallbackApproval } from './_utils/related-approval-field-helpers';

const approvalsFieldName = 'approvals';

// NOTE: Approvals can only be sent when the project is created, so they are read-only when editing a project
export const RelatedApprovalField = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<SaveCristinProject | CristinProject>();
  const isNewProject = !isSavedProject(values);
  const approvedApprovals = getApprovedApprovals(values.approvals);

  if (!isNewProject && approvedApprovals.length === 0) {
    return null;
  }

  return (
    <FormBox>
      <Typography variant="h2">{t('related_approval')}</Typography>
      {isNewProject ? (
        <>
          <Typography>{t('related_approval_description')}</Typography>
          <NewProjectApprovalSearch />
        </>
      ) : (
        <>
          <Typography>{t('approvals_cannot_be_changed')}</Typography>
          <ProjectApprovalList approvals={approvedApprovals} />
        </>
      )}
    </FormBox>
  );
};

const NewProjectApprovalSearch = () => {
  const { values, setFieldValue } = useFormikContext<SaveCristinProject>();
  const storedApproval = values.approvals?.[0];
  const approvalQuery = useFetchApprovalByIdentifier(storedApproval);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const lookupFoundNothing = !approvalQuery.isFetching && !approvalQuery.data;
  const fallbackApproval = storedApproval && lookupFoundNothing ? createFallbackApproval(storedApproval) : null;

  const changeApproval = (approval: Approval | null) => {
    setSelectedApproval(approval);
    const projectApproval = approval ? toNewProjectApproval(approval) : null;
    setFieldValue(approvalsFieldName, projectApproval ? [projectApproval] : []);
  };

  return (
    <ApprovalSearch
      selectedApproval={selectedApproval ?? approvalQuery.data ?? fallbackApproval}
      onChange={changeApproval}
      dataTestId={dataTestId.projectForm.relatedApprovalSearchField}
    />
  );
};
