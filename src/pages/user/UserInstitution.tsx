import React, { useState, FC } from 'react';
import Card from '../../components/Card';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';

import { FormikInstitutionUnit } from '../../types/institution.types';
// import { AuthorityQualifiers, addQualifierIdForAuthority } from '../../api/authorityApi';
// import { setAuthorityData } from '../../redux/actions/userActions';
// import { setNotification } from '../../redux/actions/notificationActions';
// import { NotificationVariant } from '../../types/notification.types';
// import InstitutionCardList from './institution/InstitutionCardList';
import SelectInstitution from '../../components/SelectInstitution';
import { getMostSpecificUnit } from '../../utils/institutions-helpers';
import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData } from '../../redux/actions/userActions';
import { NotificationVariant } from '../../types/notification.types';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
`;

const UserInstitution: FC = () => {
  const authority = useSelector((state: RootStore) => state.user.authority);
  const [open, setOpen] = useState(false);

  const { t } = useTranslation('profile');
  const dispatch = useDispatch();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleSubmit = async (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);
    const newUnitId = mostSpecificUnit.id.split('/').pop();

    if (authority?.orgunitids.includes(newUnitId)) {
      dispatch(setNotification(t('FINNES'), NotificationVariant.Info));
    }

    if (authority) {
      const updatedAuthority = await addQualifierIdForAuthority(
        authority?.systemControlNumber,
        AuthorityQualifiers.ORGUNIT_ID,
        newUnitId
      );
      if (updatedAuthority.error) {
        dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
      } else if (updatedAuthority) {
        dispatch(setAuthorityData(updatedAuthority));
        dispatch(setNotification(t('TODO'), NotificationVariant.Success));
      }
    }
    setOpen(false);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      {/* <InstitutionCardList /> */}
      {open ? (
        <SelectInstitution onSubmit={handleSubmit} onClose={toggleOpen} />
      ) : (
        <StyledButtonContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleOpen}
            disabled={!authority}
            data-testid="add-new-institution-button">
            {t('organization.add_institution')}
          </Button>
        </StyledButtonContainer>
      )}
    </Card>
  );
};

export default UserInstitution;
