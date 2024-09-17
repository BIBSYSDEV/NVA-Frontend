import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AuthorName } from '../../components/AuthorName';
import { SelectInstitutionForm } from '../../components/institution/SelectInstitutionForm';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { LanguageString } from '../../types/common.types';
import { CristinProject, ProjectContributorRole } from '../../types/project.types';
import { addAffiliation, AddAffiliationErrors } from '../project/helpers/projectRoleHelpers';

interface ProjectAddAffiliationModalProps {
  openAffiliationModal: boolean;
  toggleAffiliationModal: () => void;
  authorName: string;
  baseFieldName: string;
  contributorRoles: ProjectContributorRole[];
  asProjectManager?: boolean;
}

export const ProjectAddAffiliationModal = ({
  openAffiliationModal,
  toggleAffiliationModal,
  authorName,
  baseFieldName,
  contributorRoles,
  asProjectManager = false,
}: ProjectAddAffiliationModalProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<CristinProject>();
  const dispatch = useDispatch();

  const onAddAffiliation = (newAffiliationId: string, labels?: LanguageString) => {
    const newContributorRolesObject = addAffiliation(
      newAffiliationId,
      contributorRoles,
      asProjectManager,
      labels || {}
    );

    if (newContributorRolesObject.error === AddAffiliationErrors.NO_AFFILIATION_ID) {
      return;
    }

    if (newContributorRolesObject.error === AddAffiliationErrors.ADD_DUPLICATE_AFFILIATION) {
      dispatch(setNotification({ message: t('common.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    if (newContributorRolesObject.newContributorRoles) {
      setFieldValue(baseFieldName, newContributorRolesObject.newContributorRoles);
    }

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
      <SelectInstitutionForm saveAffiliation={onAddAffiliation} onCancel={toggleAffiliationModal} />
    </Modal>
  );
};
