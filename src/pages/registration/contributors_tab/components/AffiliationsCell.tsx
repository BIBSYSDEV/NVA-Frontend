import React, { FC, useState } from 'react';
import { Institution } from '../../../../types/contributor.types';
import { Button, Typography } from '@material-ui/core';
import SelectInstitution from '../../../../components/institution/SelectInstitution';
import Modal from '../../../../components/Modal';
import { useFormikContext, FormikProps } from 'formik';
import { Registration } from '../../../../types/registration.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { registrationLanguages, LanguageCodes } from '../../../../types/language.types';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import AffiliationHierarchy from '../../../../components/institution/AffiliationHierarchy';
import Card from '../../../../components/Card';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

interface AffiliationsCellProps {
  affiliations: Institution[];
  baseFieldName: string;
}

const AffiliationsCell: FC<AffiliationsCellProps> = ({ affiliations, baseFieldName }) => {
  const { t } = useTranslation('registration');
  const disptach = useDispatch();
  const { values, setFieldValue }: FormikProps<Registration> = useFormikContext();
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
          <Button
            variant="outlined"
            size="small"
            data-testid={`button-remove-affiliation-${affiliation.id}`}
            onClick={() => setAffiliationToRemove(affiliation)}>
            <DeleteIcon />
            {t('common:remove')}
          </Button>
        </StyledCard>
      ))}
      <Button variant="outlined" size="small" data-testid="button-add-affiliation" onClick={toggleAffiliationModal}>
        <AddIcon />
        {t('contributors.add_affiliation')}
      </Button>

      {/* Modal for adding affiliation */}
      <Modal
        open={openAffiliationModal}
        onClose={toggleAffiliationModal}
        headingText={t('contributors.select_institution')}>
        <SelectInstitution onClose={toggleAffiliationModal} onSubmit={addAffiliation} />
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
