import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AuthorName } from '../../components/AuthorName';
import { SelectInstitutionForm } from '../../components/institution/SelectInstitutionForm';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { LanguageString } from '../../types/common.types';
import { CristinProject, ProjectContributorRole, ProjectOrganization } from '../../types/project.types';
import { checkIfSameAffiliationOnSameRoleType } from '../project/helpers/projectContributorRoleHelpers';

interface ProjectAddAffiliationModalProps {
  openAffiliationModal: boolean;
  toggleAffiliationModal: () => void;
  authorName: string;
  baseFieldName: string;
  contributorRoles: ProjectContributorRole[];
  isProjectManager?: boolean;
}

export const ProjectAddAffiliationModal = ({
  openAffiliationModal,
  toggleAffiliationModal,
  authorName,
  baseFieldName,
  contributorRoles,
  isProjectManager = false,
}: ProjectAddAffiliationModalProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<CristinProject>();
  const dispatch = useDispatch();

  const addAffiliation = (newAffiliationId: string, labels?: LanguageString) => {
    if (!newAffiliationId || !labels) {
      return;
    }

    // Avoid adding same unit twice
    if (
      contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, isProjectManager))
    ) {
      dispatch(setNotification({ message: t('common.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    const emptyRoleIndex = contributorRoles.findIndex((role) => role.affiliation === undefined);

    const newAffiliation: ProjectOrganization = {
      type: 'Organization',
      id: newAffiliationId,
      labels: labels,
    };

    const newContributorRoles = [...contributorRoles];

    if (emptyRoleIndex < 0) {
      newContributorRoles.push({
        type: 'ProjectParticipant',
        affiliation: newAffiliation,
      } as ProjectContributorRole);
    } else {
      newContributorRoles[emptyRoleIndex] = {
        ...contributorRoles[emptyRoleIndex],
        affiliation: newAffiliation,
      };
    }

    setFieldValue(baseFieldName, newContributorRoles);
    toggleAffiliationModal();
  };

  return (
    <Modal
      open={openAffiliationModal}
      onClose={toggleAffiliationModal}
      maxWidth="md"
      fullWidth={true}
      headingText={t('project.add_affiliation')}
      dataTestId="affiliation-modal">
      <Trans
        i18nKey="project.affiliation_modal.add_new_affiliation_helper_text"
        components={[<Typography paragraph key="1" />]}
      />
      {authorName && <AuthorName authorName={authorName} description={t('project.project_participant')} />}
      <SelectInstitutionForm saveAffiliation={addAffiliation} onCancel={toggleAffiliationModal} />
    </Modal>
  );
};
