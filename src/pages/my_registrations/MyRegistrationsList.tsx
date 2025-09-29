import { Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteRegistration } from '../../api/registrationApi';
import { ResultParam, ResultSearchOrder } from '../../api/searchApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SortSelector } from '../../components/SortSelector';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationSearchItem } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';
import { RegistrationSearch, SearchPropTypes } from '../search/registration_search/RegistrationSearch';

interface MyRegistrationsListProps {
  registrationsQuery: SearchPropTypes['registrationQuery'];
}

export const MyRegistrationsList = ({ registrationsQuery }: MyRegistrationsListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<RegistrationSearchItem>();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDraftRegistration = async () => {
    if (!registrationToDelete) {
      return;
    }
    const identifierToDelete = getIdentifierFromId(registrationToDelete.id);
    setIsDeleting(true);
    const deleteRegistrationResponse = await deleteRegistration(identifierToDelete);
    if (isErrorStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
      setIsDeleting(false);
    } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
      await registrationsQuery.refetch();
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const onClickDeleteRegistration = (registration: RegistrationSearchItem) => {
    setRegistrationToDelete(registration);
    setShowDeleteModal(true);
  };

  return (
    <>
      <RegistrationSearch
        registrationQuery={registrationsQuery}
        onDeleteDraftRegistration={onClickDeleteRegistration}
        canEditRegistration
        sortingComponent={
          <SortSelector
            sortKey={ResultParam.Sort}
            orderKey={ResultParam.Order}
            paginationKey={ResultParam.From}
            aria-label={t('search.sort_by')}
            size="small"
            variant="standard"
            options={[
              { orderBy: ResultSearchOrder.ModifiedDate, sortOrder: 'desc', i18nKey: 'search.sort_by_modified_date' },
              { orderBy: ResultSearchOrder.Title, sortOrder: 'asc', i18nKey: 'search.sort_alphabetically_asc' },
              { orderBy: ResultSearchOrder.Title, sortOrder: 'desc', i18nKey: 'search.sort_alphabetically_desc' },
            ]}
          />
        }
      />

      <ConfirmDialog
        open={showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        dialogDataTestId="confirm-delete-dialog">
        <Typography>
          {t('my_page.registrations.delete_registration_message', {
            title: getTitleString(registrationToDelete?.mainTitle),
          })}
        </Typography>
      </ConfirmDialog>
    </>
  );
};
