import React, { FC } from 'react';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import Label from '../Label';
import NormalText from '../NormalText';

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
