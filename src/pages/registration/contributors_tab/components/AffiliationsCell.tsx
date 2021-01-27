import { useFormikContext } from 'formik';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineSharp';
import DeleteIcon from '@material-ui/icons/RemoveCircleSharp';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import AddInstitution from '../../../../components/institution/AddInstitution';
import AffiliationHierarchy from '../../../../components/institution/AffiliationHierarchy';
import Modal from '../../../../components/Modal';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { Institution } from '../../../../types/contributor.types';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { LanguageCodes, registrationLanguages } from '../../../../types/language.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';
import DangerButton from '../../../../components/DangerButton';

const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  margin-right: 0.5rem;
`;

const StyledAddIcon = styled(AddIcon)`
  margin-right: 0.5rem;
`;

const StyledAddButton = styled(Button)`
  margin-top: 0.5rem;
  margin-left: 0.5rem;
`;

interface AffiliationsCellProps {
  affiliations: Institution[];
  baseFieldName: string;
}

const AffiliationsCell: FC<AffiliationsCellProps> = ({ affiliations, baseFieldName }) => {
  const { t } = useTranslation('registration');
  const disptach = useDispatch();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToRemove, setAffiliationToRemove] = useState<Institution | null>(null);

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const addAffiliation = (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);

    // Avoid adding same unit twice
    if (affiliations?.some((affiliation) => affiliation.id === mostSpecificUnit.id)) {
      disptach(setNotification(t('contributors.add_duplicate_affiliation'), NotificationVariant.Info));
      return;
    }

    const labelKey =
      registrationLanguages.find((language) => language.value === values.entityDescription.language)?.id ??
      LanguageCodes.ENGLISH;

    const addedAffiliation: Institution = {
      type: BackendTypeNames.ORGANIZATION,
      id: mostSpecificUnit.id,
      labels: {
        [labelKey]: mostSpecificUnit.name,
      },
    };
    const newAffiliations = affiliations ? [...affiliations, addedAffiliation] : [addedAffiliation];
    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`, newAffiliations);
    toggleAffiliationModal();
  };

  return (
    <>
      {affiliations?.map((affiliation) => (
        <StyledCard key={affiliation.id}>
          <AffiliationHierarchy unitUri={affiliation.id} />
          <DangerButton
            size="small"
            data-testid={`button-remove-affiliation-${affiliation.id}`}
            startIcon={<StyledDeleteIcon />}
            onClick={() => setAffiliationToRemove(affiliation)}>
            {t('common:remove')}
          </DangerButton>
        </StyledCard>
      ))}
      <StyledAddButton
        size="small"
        color="primary"
        data-testid="button-add-affiliation"
        onClick={toggleAffiliationModal}>
        <StyledAddIcon />
        {t('contributors.add_affiliation')}
      </StyledAddButton>

      {/* Modal for adding affiliation */}
      <Modal
        open={openAffiliationModal}
        onClose={toggleAffiliationModal}
        headingText={t('contributors.select_institution')}
        dataTestId="affiliation-modal">
        <AddInstitution onClose={toggleAffiliationModal} onSubmit={addAffiliation} />
      </Modal>

      {/* Confirm dialog for removing affiliation */}
      <ConfirmDialog
        open={!!affiliationToRemove}
        title={t('contributors.confirm_remove_affiliation_title')}
        onAccept={() => {
          setFieldValue(
            `${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`,
            affiliations.filter((affiliation) => affiliation.id !== affiliationToRemove?.id)
          );
          setAffiliationToRemove(null);
        }}
        onCancel={() => setAffiliationToRemove(null)}>
        <Typography>{t('contributors.confirm_remove_affiliation_text')}</Typography>
      </ConfirmDialog>
    </>
  );
};

export default AffiliationsCell;
