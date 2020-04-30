import React, { FC } from 'react';
import { RecursiveInstitutionUnit } from '../types/institution.types';
import Label from './Label';
import NormalText from './NormalText';

interface AffiliationHierarchyProps {
  unit: RecursiveInstitutionUnit;
}

const AffiliationHierarchy: FC<AffiliationHierarchyProps> = ({ unit }) => (
  <>
    <Label>{unit.name}</Label>
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
