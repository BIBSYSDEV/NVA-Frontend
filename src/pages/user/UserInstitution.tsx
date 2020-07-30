import React, { useState, FC } from 'react';
import Card from '../../components/Card';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';

import { FormikInstitutionUnit } from '../../types/institution.types';
import SelectInstitution from '../../components/institution/SelectInstitution';
import { getMostSpecificUnit } from '../../utils/institutions-helpers';
import {
  addQualifierIdForAuthority,
  AuthorityQualifiers,
  removeQualifierIdFromAuthority,
} from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData } from '../../redux/actions/userActions';
import { NotificationVariant } from '../../types/notification.types';
import InstitutionCard from './institution/InstitutionCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { StyledRightAlignedButtonWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';

const UserInstitution: FC = () => {
  const authority = useSelector((state: RootStore) => state.user.authority);
  const [openUnitForm, setOpenUnitForm] = useState(false);
  const [affiliationIdToRemove, setAffiliationIdToRemove] = useState('');
  const [isRemovingAffiliation, setIsRemovingAffiliation] = useState(false);

  const { t } = useTranslation('profile');
  const dispatch = useDispatch();

  const toggleUnitForm = () => {
    setOpenUnitForm(!openUnitForm);
  };

  const removeAffiliation = async () => {
    if (!authority || !affiliationIdToRemove) {
      return;
    }
    setIsRemovingAffiliation(true);
    const updatedAuthority = await removeQualifierIdFromAuthority(
      authority.systemControlNumber,
      AuthorityQualifiers.ORGUNIT_ID,
      affiliationIdToRemove
    );
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.delete_affiliation')));
    }
    setAffiliationIdToRemove('');
    setIsRemovingAffiliation(false);
  };

  const handleSubmit = async (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);
    const newUnitId = mostSpecificUnit.id;

    if (!newUnitId) {
      return;
    } else if (authority?.orgunitids.includes(newUnitId)) {
      dispatch(setNotification(t('feedback:info.affiliation_already_exists'), NotificationVariant.Info));
      return;
    }

    if (authority) {
      const updatedAuthority = await addQualifierIdForAuthority(
        authority.systemControlNumber,
        AuthorityQualifiers.ORGUNIT_ID,
        newUnitId
      );
      if (updatedAuthority.error) {
        dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
      } else if (updatedAuthority) {
        dispatch(setAuthorityData(updatedAuthority));
        dispatch(setNotification(t('feedback:success.added_affiliation'), NotificationVariant.Success));
      }
    }
    setOpenUnitForm(false);
  };

  return (
    <>
      <Card>
        <Heading>{t('heading.organizations')}</Heading>
        {authority?.orgunitids &&
          authority.orgunitids.map((orgunitId) => (
            <InstitutionCard
              key={orgunitId}
              orgunitId={orgunitId}
              setAffiliationIdToRemove={setAffiliationIdToRemove}
            />
          ))}

        {openUnitForm ? (
          <SelectInstitution onSubmit={handleSubmit} onClose={toggleUnitForm} />
        ) : (
          <StyledRightAlignedButtonWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleUnitForm}
              disabled={!authority}
              data-testid="add-new-institution-button">
              {t('organization.add_institution')}
            </Button>
          </StyledRightAlignedButtonWrapper>
        )}
      </Card>
      <ConfirmDialog
        open={!!affiliationIdToRemove}
        title={t('organization.confirm_remove_affiliation_title')}
        onAccept={removeAffiliation}
        onCancel={() => setAffiliationIdToRemove('')}
        disableAccept={isRemovingAffiliation}>
        <NormalText>{t('organization.confirm_remove_affiliation_text')}</NormalText>
      </ConfirmDialog>
    </>
  );
};

export default UserInstitution;
