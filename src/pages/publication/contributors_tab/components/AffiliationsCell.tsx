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
import NormalText from '../../../../components/NormalText';
import styled from 'styled-components';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { publicationLanguages, LanguageCodes } from '../../../../types/language.types';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';

const StyledAffiliationsCell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledRemoveAffiliationButton = styled(Button)`
  margin-left: 1rem;
`;
const StyledAddAffiliationButton = styled(Button)`
  margin-top: 0.5rem;
`;

interface AffiliationsCellProps {
  affiliations: Institution[];
  baseFieldName: string;
  contributorName: string;
}

const AffiliationsCell: FC<AffiliationsCellProps> = ({ affiliations, baseFieldName, contributorName }) => {
  const { t } = useTranslation('publication');
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToRemove, setAffiliationToRemove] = useState<Institution | null>(null);
  const { values, setFieldValue }: FormikProps<FormikPublication> = useFormikContext();

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const addAffiliation = (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);
    // TODO: Set hierarchy in state? get from backend?

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
        <StyledAffiliationsCell key={affiliation.id}>
          <NormalText>{Object.values(affiliation.labels)[0]}</NormalText>
          <StyledRemoveAffiliationButton
            variant="outlined"
            size="small"
            onClick={() => setAffiliationToRemove(affiliation)}>
            <DeleteIcon />
            {t('common:remove')}
          </StyledRemoveAffiliationButton>
        </StyledAffiliationsCell>
      ))}
      <StyledAddAffiliationButton variant="outlined" size="small" onClick={toggleAffiliationModal}>
        <AddIcon />
        {t('contributors.add_affiliation')}
      </StyledAddAffiliationButton>

      {/* Modal for adding affiliation */}
      <Modal
        openModal={openAffiliationModal}
        onClose={toggleAffiliationModal}
        headingText={t('contributors.select_institution')}>
        <SelectInstitution
          onClose={toggleAffiliationModal}
          onSubmit={addAffiliation}
          excludeAffiliationIds={affiliations?.map((affiliation) => affiliation.id)}
        />
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

export default AffiliationsCell;
