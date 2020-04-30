import React, { FC, useState } from 'react';
import { Institution } from '../../../../types/contributor.types';
import { Button } from '@material-ui/core';
import SelectInstitution from '../../../../components/SelectInstitution';
import Modal from '../../../../components/Modal';
import { useFormikContext, FormikProps } from 'formik';
import { FormikPublication, BackendTypeNames } from '../../../../types/publication.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { publicationLanguages, LanguageCodes } from '../../../../types/language.types';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import useFetchUnitHierarchy from '../../../../utils/hooks/useFetchUnitHierarchy';
import AffiliationHierarchy from '../../../../components/AffiliationHierarchy';
import Progress from '../../../../components/Progress';
import Card from '../../../../components/Card';

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
  contributorName: string;
}

const AffiliationsCell: FC<AffiliationsCellProps> = ({ affiliations, baseFieldName, contributorName }) => {
  const { t } = useTranslation('publication');
  const disptach = useDispatch();
  const { values, setFieldValue }: FormikProps<FormikPublication> = useFormikContext();
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
      publicationLanguages.find((language) => language.value === values.entityDescription.language)?.id ??
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
          <AffiliationElement unitUri={affiliation.id} />
          <Button variant="outlined" size="small" onClick={() => setAffiliationToRemove(affiliation)}>
            <DeleteIcon />
            {t('common:remove')}
          </Button>
        </StyledCard>
      ))}
      <Button variant="outlined" size="small" onClick={toggleAffiliationModal}>
        <AddIcon />
        {t('contributors.add_affiliation')}
      </Button>

      {/* Modal for adding affiliation */}
      <Modal
        openModal={openAffiliationModal}
        onClose={toggleAffiliationModal}
        headingText={t('contributors.select_institution')}>
        <SelectInstitution onClose={toggleAffiliationModal} onSubmit={addAffiliation} />
      </Modal>

      {/* Confirm dialog for removing affiliation */}
      <ConfirmDialog
        open={!!affiliationToRemove}
        title={t('contributors.confirm_remove_affiliation_title')}
        text={t('contributors.confirm_remove_affiliation_text', {
          affiliationName: Object.values(affiliationToRemove?.labels ?? {})[0],
          contributorName: contributorName,
        })}
        onAccept={() => {
          setFieldValue(
            `${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`,
            affiliations.filter((affiliation) => affiliation.id !== affiliationToRemove?.id)
          );
          setAffiliationToRemove(null);
        }}
        onCancel={() => setAffiliationToRemove(null)}
      />
    </>
  );
};

const AffiliationElement: FC<any> = ({ unitUri }) => {
  const [unit, isLoadingUnitHierarchy] = useFetchUnitHierarchy(unitUri);

  return <div>{isLoadingUnitHierarchy ? <Progress /> : unit ? <AffiliationHierarchy unit={unit} /> : null}</div>;
};

export default AffiliationsCell;
