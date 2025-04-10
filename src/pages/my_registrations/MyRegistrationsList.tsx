import { Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import { deleteRegistration } from '../../api/registrationApi';
import { ResultParam } from '../../api/searchApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ListPagination } from '../../components/ListPagination';
import { RegistrationList } from '../../components/RegistrationList';
import { setNotification } from '../../redux/notificationSlice';
import { SearchResponse2 } from '../../types/common.types';
import { RegistrationAggregations, RegistrationSearchItem } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus, ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { getTitleString } from '../../utils/registration-helpers';

interface MyRegistrationsListProps {
  registrationsQuery: UseQueryResult<SearchResponse2<RegistrationSearchItem, RegistrationAggregations>>;
}

export const MyRegistrationsList = ({ registrationsQuery }: MyRegistrationsListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [, setSearchParams] = useSearchParams();
  const { from, results } = useRegistrationsQueryParams();

  const registrations = useMemo(() => registrationsQuery.data?.hits ?? [], [registrationsQuery.data]);

  useEffect(() => {
    if (registrations.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [registrations]);

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

  const rowsPerPage = (results && +results) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (from && rowsPerPage && Math.floor(+from / rowsPerPage)) || 0;

  return (
    <>
      {registrations.length > 0 ? (
        <ListPagination
          count={registrationsQuery.data?.totalHits ?? 0}
          rowsPerPage={rowsPerPage}
          page={page + 1}
          onPageChange={(newPage) =>
            setSearchParams((params) => {
              params.set(ResultParam.From, ((newPage - 1) * rowsPerPage).toString());
              return params;
            })
          }
          onRowsPerPageChange={(newRowsPerPage) => {
            setSearchParams((params) => {
              params.set(ResultParam.Results, newRowsPerPage.toString());
              params.delete(ResultParam.From);
              return params;
            });
          }}>
          <RegistrationList
            onDeleteDraftRegistration={onClickDeleteRegistration}
            registrations={registrations}
            canEditRegistration
          />
        </ListPagination>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}

      {/* <RegistrationSearch registrationQuery={registrationsQuery} onDeleteRegistration={onClickDeleteRegistration} /> */}

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
