import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { AuthorName } from '../../components/AuthorName';
import { SelectInstitutionForm } from '../../components/institution/SelectInstitutionForm';
import { SelectInstitutionSkeleton } from '../../components/institution/SelectInstitutionSkeleton';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { LanguageString } from '../../types/common.types';
import { Organization } from '../../types/organization.types';
import { CristinProject, ProjectContributorRole, ProjectOrganization } from '../../types/project.types';
import { findDescendantWithId, getTopLevelOrganization } from '../../utils/institutions-helpers';

interface EditProjectAffiliationModalProps {
  affiliationModalIsOpen: boolean;
  toggleAffiliationModal: () => void;
  preselectedOrganization: Organization;
  authorName: string;
  baseFieldName: string;
  contributorRoles: ProjectContributorRole[];
}

export const ProjectEditAffiliationModal = ({
  affiliationModalIsOpen,
  toggleAffiliationModal,
  authorName,
  preselectedOrganization,
  baseFieldName,
  contributorRoles,
}: EditProjectAffiliationModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext<CristinProject>();
  const institution = getTopLevelOrganization(preselectedOrganization);
  const institutionQuery = useFetchOrganization(institution.id);

  const editAffiliation = (newAffiliationId: string, labels?: LanguageString) => {
    if (!newAffiliationId || !labels) {
      return;
    }
    const roleToChangeIndex = contributorRoles.findIndex(
      (role) => role.affiliation.type === 'Organization' && role.affiliation.id === preselectedOrganization.id
    );

    if (roleToChangeIndex < 0) {
      return;
    }

    // If user tries to change affiliation to an already existing affiliation
    if (
      contributorRoles.some(
        (role) => role.affiliation.type === 'Organization' && role.affiliation.id === newAffiliationId
      )
    ) {
      dispatch(setNotification({ message: t('common.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    const newAffiliation: ProjectOrganization = {
      type: 'Organization',
      id: newAffiliationId,
      labels: labels,
    };

    console.log('newAffiliation', newAffiliation);

    const newContributorRoles = [...contributorRoles];

    newContributorRoles[roleToChangeIndex] = {
      ...contributorRoles[roleToChangeIndex],
      affiliation: newAffiliation,
    };

    console.log('newContributorRoles', newContributorRoles);

    setFieldValue(baseFieldName, newContributorRoles);
    toggleAffiliationModal();
  };

  return (
    <Modal
      open={affiliationModalIsOpen}
      onClose={() => {
        toggleAffiliationModal();
      }}
      maxWidth="md"
      fullWidth
      headingText={t('project.affiliation_modal.edit_affiliation')}>
      <Trans
        i18nKey="project.affiliation_modal.add_new_affiliation_helper_text"
        components={[<Typography key="1" paragraph />]}
      />
      {authorName && <AuthorName authorName={authorName} description={t('project.project_participant')} />}
      {institutionQuery.isPending ? (
        <SelectInstitutionSkeleton />
      ) : institutionQuery.data ? (
        <SelectInstitutionForm
          saveAffiliation={editAffiliation}
          onCancel={toggleAffiliationModal}
          initialValues={{
            unit: institutionQuery.data,
            subunit:
              preselectedOrganization.id !== institutionQuery.data.id
                ? findDescendantWithId(institutionQuery.data, preselectedOrganization.id)
                : null,
            selectedSuggestedAffiliationId: '',
          }}
        />
      ) : (
        <Typography sx={{ fontStyle: 'italic' }}>[{t('feedback.error.get_organization')}]</Typography>
      )}
    </Modal>
  );
};
