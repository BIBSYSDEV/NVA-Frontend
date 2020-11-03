import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import {
  addQualifierIdForAuthority,
  AuthorityQualifiers,
  removeQualifierIdFromAuthority,
  updateQualifierIdForAuthority,
} from '../../api/authorityApi';
import Card from '../../components/Card';
import ConfirmDialog from '../../components/ConfirmDialog';
import SelectInstitution from '../../components/institution/SelectInstitution';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData } from '../../redux/actions/userActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { FormikInstitutionUnit } from '../../types/institution.types';
import { NotificationVariant } from '../../types/notification.types';
import { getMostSpecificUnit } from '../../utils/institutions-helpers';
import InstitutionCard from './institution/InstitutionCard';

const UserInstitution: FC = () => {
  const authority = useSelector((state: RootStore) => state.user.authority);
  const [openUnitForm, setOpenUnitForm] = useState(false);
  const [affiliationIdToRemove, setAffiliationIdToRemove] = useState('');
  const [isRemovingAffiliation, setIsRemovingAffiliation] = useState(false);
  const [newOrgunitId, setNewOrgunitId] = useState('');
  const [initialInstitutionId, setInitialInstitutionId] = useState('');

  const { t, i18n } = useTranslation('profile');
  const dispatch = useDispatch();

  useEffect(() => {
    // Close institution form if user changes language, since selected values will be invalid
    setOpenUnitForm(false);
  }, [i18n.language]);

  const toggleUnitForm = () => {
    setOpenUnitForm(!openUnitForm);
  };

  // TODO1: close editAffiliation when pressing "cancel"
  // TODO2: actually make call to backend to edit affiliation
  // TODO3: cleanup

  const openEditUnitForm = (initialOrgunitId: string) => {
    setOpenUnitForm(true);
    console.log('initialOrgunitId', initialOrgunitId);
    setInitialInstitutionId(initialOrgunitId);
  };

  const editAffiliation = async (oldIdentifier: string) => {
    if (!authority) {
      return;
    }
    const updatedAuthority = await updateQualifierIdForAuthority(
      authority.systemControlNumber,
      AuthorityQualifiers.ORGUNIT_ID,
      oldIdentifier,
      newOrgunitId
    );
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.update_authority')));
    }
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
        <Typography variant="h5">{t('heading.organizations')}</Typography>
        {authority?.orgunitids &&
          authority.orgunitids.map((orgunitId) => (
            <InstitutionCard
              key={orgunitId}
              openEditUnitForm={openEditUnitForm}
              orgunitId={orgunitId}
              setAffiliationIdToRemove={setAffiliationIdToRemove}
            />
          ))}

        {openUnitForm ? (
          <SelectInstitution
            initialInstitutionId={initialInstitutionId}
            onSubmit={handleSubmit}
            onClose={toggleUnitForm}
          />
        ) : (
          <StyledRightAlignedWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleUnitForm}
              disabled={!authority}
              data-testid="add-new-institution-button">
              {t('organization.add_institution')}
            </Button>
          </StyledRightAlignedWrapper>
        )}
      </Card>
      <ConfirmDialog
        open={!!affiliationIdToRemove}
        title={t('organization.confirm_remove_affiliation_title')}
        onAccept={removeAffiliation}
        onCancel={() => setAffiliationIdToRemove('')}
        isLoading={isRemovingAffiliation}>
        <Typography>{t('organization.confirm_remove_affiliation_text')}</Typography>
      </ConfirmDialog>
    </>
  );
};

export default UserInstitution;
