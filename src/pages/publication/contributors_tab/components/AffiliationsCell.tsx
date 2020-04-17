import React, { FC, useState } from 'react';
import { Institution } from '../../../../types/contributor.types';
import SelectInstitution from '../../../../components/SelectInstitution';
import { Button } from '@material-ui/core';
import Modal from '../../../../components/Modal';
import { useFormikContext, FormikProps } from 'formik';
import { FormikPublication, BackendTypeNames } from '../../../../types/publication.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { useTranslation } from 'react-i18next';
import NormalText from '../../../../components/NormalText';
import styled from 'styled-components';

const StyledNormalText = styled(NormalText)`
  margin-bottom: 1rem;
`;

interface AffiliationsCellProps {
  affiliations: Institution[];
  baseFieldName: string;
}

const AffiliationsCell: FC<AffiliationsCellProps> = ({ affiliations, baseFieldName }) => {
  const { t } = useTranslation('publication');
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const { setFieldValue }: FormikProps<FormikPublication> = useFormikContext();

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const addAffiliation = (value: FormikInstitutionUnit) => {
    // TODO: Set hierarchy in state? get from backend?
    const mostSpecificUnit = value.subunits.pop() ?? value;
    const addedAffiliation: Institution = {
      type: BackendTypeNames.ORGANIZATION,
      id: mostSpecificUnit.id,
      labels: {
        nb: mostSpecificUnit.name,
      },
    };
    const newAffiliations = affiliations ? [...affiliations, addedAffiliation] : [addedAffiliation];
    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`, newAffiliations);
    toggleAffiliationModal();
  };

  return (
    <>
      {affiliations?.map((affiliation) => (
        <AffiliationElement key={affiliation.id} affiliation={affiliation} />
      ))}
      <Button variant="contained" color="primary" onClick={toggleAffiliationModal}>
        {t('contributors.add_affiliation')}
      </Button>
      <Modal openModal={openAffiliationModal} onClose={toggleAffiliationModal} headingText="Velg institusjon">
        <SelectInstitution onClose={toggleAffiliationModal} onSubmit={addAffiliation}></SelectInstitution>
      </Modal>
    </>
  );
};

interface AffiliationElementProps {
  affiliation: Institution;
}

const AffiliationElement: FC<AffiliationElementProps> = ({ affiliation }) => {
  return <StyledNormalText>{Object.values(affiliation.labels)[0]}</StyledNormalText>;
};

export default AffiliationsCell;
