import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { AuthorName } from '../../../../components/AuthorName';
import { SelectInstitutionForm } from '../../../../components/institution/SelectInstitutionForm';
import { SelectInstitutionSkeleton } from '../../../../components/institution/SelectInstitutionSkeleton';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/notificationSlice';
import { Affiliation } from '../../../../types/contributor.types';
import { Organization } from '../../../../types/organization.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { findDescendantWithId, getTopLevelOrganization } from '../../../../utils/institutions-helpers';

interface EditAffiliationModalProps {
  affiliationModalIsOpen: boolean;
  toggleAffiliationModal: () => void;
  affiliationToEdit: Organization;
  baseFieldName: string;
  authorName?: string;
  affiliations?: Affiliation[];
}

export const EditAffiliationModal = ({
  affiliationModalIsOpen,
  toggleAffiliationModal,
  affiliationToEdit,
  authorName,
  affiliations = [],
  baseFieldName,
}: EditAffiliationModalProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Registration>();
  const dispatch = useDispatch();
  const institution = getTopLevelOrganization(affiliationToEdit);
  const institutionQuery = useFetchOrganization(institution.id);

  const editAffiliation = (newAffiliationId: string) => {
    if (!newAffiliationId) {
      return;
    }

    const affiliationToChangeIndex = affiliations.findIndex(
      (a) => a.type === 'Organization' && a.id === affiliationToEdit.id
    );

    if (affiliationToChangeIndex < 0) {
      return;
    }

    // If user tries to change it into already existing affiliation
    if (
      affiliations.some(
        (affiliation, index) =>
          index !== affiliationToChangeIndex &&
          affiliation.type === 'Organization' &&
          affiliation.id === newAffiliationId
      )
    ) {
      dispatch(setNotification({ message: t('common.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    const newAffiliation: Affiliation = {
      type: 'Organization',
      id: newAffiliationId,
    };

    const updatedAffiliations = [...affiliations];

    // Replace old affiliation
    updatedAffiliations[affiliationToChangeIndex] = newAffiliation;

    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`, updatedAffiliations);
    toggleAffiliationModal();
  };

  return (
    <Modal
      open={affiliationModalIsOpen}
      onClose={toggleAffiliationModal}
      maxWidth="md"
      fullWidth
      headingText={t('registration.contributors.edit_affiliation')}>
      <Trans
        i18nKey="registration.contributors.edit_affiliation_helper_text"
        components={[<Typography key="1" sx={{ mb: '1rem' }} />]}
      />
      {authorName && <AuthorName authorName={authorName} />}
      {institutionQuery.isPending ? (
        <SelectInstitutionSkeleton />
      ) : institutionQuery.data ? (
        <SelectInstitutionForm
          saveAffiliation={editAffiliation}
          onCancel={toggleAffiliationModal}
          initialValues={{
            unit: institutionQuery.data,
            subunit:
              affiliationToEdit.id !== institutionQuery.data.id
                ? findDescendantWithId(institutionQuery.data, affiliationToEdit.id)
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
