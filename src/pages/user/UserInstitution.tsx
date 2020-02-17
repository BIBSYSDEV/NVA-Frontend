import React, { useState, useEffect, FC } from 'react';
import UserCard from './UserCard';
import { InstitutionUnit, emptyInstitutionUnit } from './../../types/institution.types';
import InstitutionCard from './InstitutionCard';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { getInstitutionUnitNames } from '../../api/institutionApi';
import { addInstitutionForAuthority } from '../../api/authorityApi';
import { addNotification } from '../../redux/actions/notificationActions';
import { addInstitutionUnit } from '../../redux/actions/institutionActions';
import { setAuthorityData } from './../../redux/actions/userActions';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './InstitutionSelector';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const UserInstitution: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const [institutionUnits, setInstitutionUnits] = useState<InstitutionUnit[]>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newInstitutionUnits = institutionUnits.filter(
      institutionUnit =>
        !user.institutionUnits.some(
          storedInstitutionUnit => storedInstitutionUnit.cristinUnitId === institutionUnit.cristinUnitId
        )
    );
    newInstitutionUnits.forEach(institutionUnit => {
      if (institutionUnit.cristinUnitId !== '') dispatch(addInstitutionUnit(institutionUnit));
    });
  }, [institutionUnits, user.institutionUnits, dispatch]);

  const handleClickAdd = () => {
    setInstitutionUnits([...institutionUnits, emptyInstitutionUnit]);
    setOpen(true);
  };

  const addInstitution = async (cristinUnitId: string) => {
    if (!institutionUnits.find(institutionUnit => institutionUnit.cristinUnitId === cristinUnitId)) {
      const newInstitutionUnit: InstitutionUnit = await getInstitutionUnitNames(cristinUnitId);
      setInstitutionUnits([
        ...institutionUnits.filter(institutionUnit => institutionUnit.cristinUnitId !== ''),
        newInstitutionUnit,
      ]);

      const updatedAuthority = await addInstitutionForAuthority(
        cristinUnitId,
        user.authority.orgunitids,
        user.authority.systemControlNumber
      );
      if (updatedAuthority?.error) {
        dispatch(addNotification(updatedAuthority.error, 'error'));
      } else if (updatedAuthority) {
        dispatch(setAuthorityData(updatedAuthority));
        try {
          const institutionUnit = await getInstitutionUnitNames(cristinUnitId);
          if (institutionUnit.cristinUnitId !== '') dispatch(addInstitutionUnit(institutionUnit));
        } catch {
          dispatch(addNotification(t('search_institution'), 'error'));
        }
      }
    } else {
      setInstitutionUnits(institutionUnits.filter(institutionUnit => institutionUnit.cristinUnitId !== ''));
    }
  };

  return (
    <UserCard headingLabel={t('heading.organizations')}>
      <>
        {institutionUnits.map((institutionUnit: InstitutionUnit) => (
          <InstitutionCard key={institutionUnit.cristinUnitId} institutionUnit={institutionUnit} />
        ))}
        {open && <InstitutionSelector addNewInstitutionUnit={addInstitution} setOpen={setOpen} />}
        <StyledButtonContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickAdd}
            disabled={!user.authority?.systemControlNumber}
            data-testid="add-new-institution-button">
            {t('organization.add_institution')}
          </Button>
        </StyledButtonContainer>
      </>
    </UserCard>
  );
};

export default UserInstitution;
