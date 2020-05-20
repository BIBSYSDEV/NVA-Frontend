import React, { FC } from 'react';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import Label from '../Label';
import NormalText from '../NormalText';
import useFetchUnitHierarchy from '../../utils/hooks/useFetchUnitHierarchy';
import { getCommaSeparatedUnitString } from '../../utils/institutions-helpers';
import { CircularProgress } from '@material-ui/core';

interface PublicationPageAffiliationProps {
  unitUri: string;
  commaSeparated?: boolean;
  boldTopLevel?: boolean;
}

export const PublicationPageAffiliation: FC<PublicationPageAffiliationProps> = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
}) => {
  const [unit, isLoadingUnit] = useFetchUnitHierarchy(unitUri);

  return isLoadingUnit ? (
    <CircularProgress size={20} />
  ) : unit ? (
    commaSeparated ? (
      <>{getCommaSeparatedUnitString(unit)}</>
    ) : (
      <AffiliationHierarchy unit={unit} boldTopLevel={boldTopLevel} />
    )
  ) : null;
};

interface AffiliationHierarchyProps {
  unit: RecursiveInstitutionUnit;
  boldTopLevel?: boolean;
}

const AffiliationHierarchy: FC<AffiliationHierarchyProps> = ({ unit, boldTopLevel = true }) => (
  <>
    {boldTopLevel ? <Label>{unit.name}</Label> : <NormalText>{unit.name}</NormalText>}
    {unit?.subunits && <SubUnitRow unit={unit.subunits[0]} />}
  </>
);

const SubUnitRow: FC<AffiliationHierarchyProps> = ({ unit }) => (
  <>
    <NormalText>{unit.name}</NormalText>
    {unit.subunits && <SubUnitRow unit={unit.subunits[0]} />}
  </>
);

export default AffiliationHierarchy;
