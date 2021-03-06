import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  addQualifierIdForAuthority,
  AuthorityQualifiers,
  removeQualifierIdFromAuthority,
} from '../../api/authorityApi';
import { Card } from '../../components/Card';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AddInstitution } from '../../components/institution/AddInstitution';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData } from '../../redux/actions/userActions';
import { FormikInstitutionUnit } from '../../types/institution.types';
import { NotificationVariant } from '../../types/notification.types';
import { getMostSpecificUnit } from '../../utils/institutions-helpers';
import { InstitutionCard } from './institution/InstitutionCard';
import { User } from '../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

interface UserInstituionProps {
  user: User;
}

export const UserAffiliations = ({ user }: UserInstituionProps) => {
  const [openAddInstitutionForm, setOpenAddInstitutionForm] = useState(false);
  const [institutionIdToRemove, setInstitutionIdToRemove] = useState('');
  const [isRemovingInstitution, setIsRemovingInstitution] = useState(false);

  const { t, i18n } = useTranslation('profile');
  const dispatch = useDispatch();

  useEffect(() => {
    // Close institution form if user changes language, since selected values will be invalid
    setOpenAddInstitutionForm(false);
  }, [i18n.language]);

  const toggleUnitForm = () => {
    setOpenAddInstitutionForm(!openAddInstitutionForm);
  };

  const removeInstitution = async () => {
    if (!user.authority || !institutionIdToRemove) {
      return;
    }
    setIsRemovingInstitution(true);
    const updateAuthorityResponse = await removeQualifierIdFromAuthority(
      user.authority.id,
      AuthorityQualifiers.ORGUNIT_ID,
      institutionIdToRemove
    );
    if (isErrorStatus(updateAuthorityResponse.status)) {
      dispatch(
        setNotification(
          t('feedback:error.delete_identifier', { qualifier: t(`common:${AuthorityQualifiers.ORGUNIT_ID}`) }),
          NotificationVariant.Error
        )
      );
    } else if (isSuccessStatus(updateAuthorityResponse.status)) {
      dispatch(setAuthorityData(updateAuthorityResponse.data));
      dispatch(setNotification(t('feedback:success.delete_affiliation')));
    }

    setInstitutionIdToRemove('');
    setIsRemovingInstitution(false);
  };

  const handleAddInstitution = async (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);
    const newUnitId = mostSpecificUnit.id;

    if (!newUnitId) {
      return;
    } else if (user.authority?.orgunitids.includes(newUnitId)) {
      dispatch(setNotification(t('feedback:info.affiliation_already_exists'), NotificationVariant.Info));
      return;
    }

    if (user.authority) {
      const updateAuthorityResponse = await addQualifierIdForAuthority(
        user.authority.id,
        AuthorityQualifiers.ORGUNIT_ID,
        newUnitId
      );
      if (isErrorStatus(updateAuthorityResponse.status)) {
        dispatch(
          setNotification(
            t('feedback:error.update_authority', { qualifier: t(`common:${AuthorityQualifiers.ORGUNIT_ID}`) }),
            NotificationVariant.Error
          )
        );
      } else if (isSuccessStatus(updateAuthorityResponse.status)) {
        dispatch(setAuthorityData(updateAuthorityResponse.data));
        dispatch(setNotification(t('feedback:success.added_affiliation'), NotificationVariant.Success));
      }
    }
    setOpenAddInstitutionForm(false);
  };

  return (
    <>
      <Card>
        <Typography variant="h2">{t('heading.affiliations')}</Typography>
        {user.authority?.orgunitids &&
          user.authority.orgunitids.map((orgunitId) => (
            <InstitutionCard
              key={orgunitId}
              orgunitId={orgunitId}
              setInstitutionIdToRemove={setInstitutionIdToRemove}
            />
          ))}

        {openAddInstitutionForm ? (
          <AddInstitution onSubmit={handleAddInstitution} onClose={toggleUnitForm} />
        ) : (
          <StyledRightAlignedWrapper>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleUnitForm}
              disabled={!user.authority}
              startIcon={<AddIcon />}
              data-testid="add-new-institution-button">
              {t('affiliations.add_affiliation')}
            </Button>
          </StyledRightAlignedWrapper>
        )}
      </Card>
      <ConfirmDialog
        open={!!institutionIdToRemove}
        title={t('affiliations.confirm_remove_affiliation_title')}
        onAccept={removeInstitution}
        onCancel={() => setInstitutionIdToRemove('')}
        isLoading={isRemovingInstitution}
        dataTestId="confirm-remove-affiliation-dialog">
        <Typography>{t('affiliations.confirm_remove_affiliation_text')}</Typography>
      </ConfirmDialog>
    </>
  );
};
