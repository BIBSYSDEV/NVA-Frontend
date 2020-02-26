import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Unit, UnitBase } from '../../../types/institution.types';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { AuthorityQualifiers, removeIdFromAuthority } from '../../../api/authorityApi';
import { addNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import NormalText from '../../../components/NormalText';

const StyledSelectedInstitution = styled.div`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: auto 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: 5rem;
  border-radius: 4px;
`;

const StyledTextContainer = styled.div`
  grid-area: text;
`;

const StyledButtonContainer = styled.div`
  grid-area: button;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface InstitutionCardProps {
  unit: Unit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ unit }) => {
  const { t } = useTranslation('common');
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  const handleRemoveInstitution = async () => {
    const idToRemove = unit.subunits.length > 0 ? unit.subunits.slice(-1)[0].id : unit.id;
    const updatedAuthority = await removeIdFromAuthority(
      user.authority.systemControlNumber,
      AuthorityQualifiers.ORGUNIT_ID,
      idToRemove
    );
    if (updatedAuthority.error) {
      dispatch(addNotification(updatedAuthority.error, 'error'));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(addNotification(t('feedback:success.delete_identifier')));
    }
  };

  return (
    <StyledSelectedInstitution data-testid="institution-presentation">
      <StyledTextContainer>
        <Label>{unit.name}</Label>
        {unit.subunits?.map((subunit: UnitBase) => (
          <NormalText key={subunit.id} data-testid="institution-presentation-subunit">
            {subunit.name}
          </NormalText>
        ))}
      </StyledTextContainer>
      <StyledButtonContainer>
        <Button color="secondary" data-testid={`delete-publication-${unit.id}`} onClick={handleRemoveInstitution}>
          <DeleteIcon />
          {t('remove')}
        </Button>
      </StyledButtonContainer>
    </StyledSelectedInstitution>
  );
};

export default InstitutionCard;
