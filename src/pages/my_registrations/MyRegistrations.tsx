import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import { useMyRegistrationsSearch } from '../../api/hooks/useMyRegistrationsSearch';
import { deleteRegistration } from '../../api/registrationApi';
import { ProtectedResultParam, ResultParam, ResultSearchOrder, SortOrder } from '../../api/searchApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DocumentHeadTitle } from '../../components/DocumentHeadTitle';
import { ListSkeleton } from '../../components/ListSkeleton';
import { SearchForm } from '../../components/SearchForm';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { syncParamsWithSearchFields } from '../../utils/searchHelpers';
import { MyRegistrationsList } from './MyRegistrationsList';

const statusRadioGroupLabelId = 'status-radio-buttons-group-label';

export const MyRegistrations = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [, setSearchParams] = useSearchParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const params = useRegistrationsQueryParams();
  const statusValue = params.status?.[0] ?? RegistrationStatus.Draft;

  const myRegistrationsQuery = useMyRegistrationsSearch({
    ...params,
    status: [statusValue],
    order: params.order ?? ResultSearchOrder.ModifiedDate,
    sort: params.sort ?? ('desc' satisfies SortOrder),
  });

  const registrations = myRegistrationsQuery.data?.hits ?? [];

  const deleteDraftRegistrationMutation = useMutation({
    mutationFn: async () => {
      const draftRegistrations = registrations.filter(
        (registration) => registration.recordMetadata.status === RegistrationStatus.Draft
      );
      const deletePromises = draftRegistrations.map((registration) => deleteRegistration(registration.identifier));
      await Promise.all(deletePromises);
      await myRegistrationsQuery.refetch();
    },
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.delete_draft_registrations'), variant: 'success' }));
      setShowDeleteModal(false);
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.delete_draft_registrations'), variant: 'error' })),
  });

  return (
    <section>
      <DocumentHeadTitle>{t('common.result_registrations')}</DocumentHeadTitle>

      <Box sx={{ mx: { xs: '0.5rem', md: 0 } }}>
        <Typography variant="h1" sx={{ mb: '1rem' }}>
          {t('common.result_registrations')}
        </Typography>

        <search>
          <SearchForm
            placeholder={t('search.search_placeholder')}
            sx={{ mb: '0.5rem' }}
            paginationOffsetParamName={ResultParam.From}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" id={statusRadioGroupLabelId}>
                {t('common.status')}
              </FormLabel>
              <RadioGroup
                aria-labelledby={statusRadioGroupLabelId}
                row
                value={statusValue}
                onChange={(_, value) =>
                  setSearchParams((params) => {
                    const syncedParams = syncParamsWithSearchFields(params);
                    syncedParams.set(ProtectedResultParam.Status, value);
                    syncedParams.delete(ResultParam.From);
                    return syncedParams;
                  })
                }>
                <FormControlLabel
                  data-testid={dataTestId.myPage.myRegistrationsUnpublishedCheckbox}
                  value={RegistrationStatus.Draft}
                  control={<Radio />}
                  label={t('registration.status.DRAFT')}
                />
                <FormControlLabel
                  data-testid={dataTestId.myPage.myRegistrationsPublishedCheckbox}
                  value={RegistrationStatus.Published}
                  control={<Radio />}
                  label={t('registration.status.PUBLISHED')}
                />
              </RadioGroup>
            </FormControl>

            {statusValue === RegistrationStatus.Draft && (
              <Button variant="outlined" onClick={() => setShowDeleteModal(true)} disabled={registrations.length === 0}>
                {t('my_page.registrations.delete_draft_registrations')}
              </Button>
            )}
          </Box>
        </search>
      </Box>

      {myRegistrationsQuery.isPending ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MyRegistrationsList registrationsQuery={myRegistrationsQuery} />
      )}

      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={() => deleteDraftRegistrationMutation.mutate()}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteDraftRegistrationMutation.isPending}>
        <Typography>
          {t('my_page.registrations.delete_count_draft_registrations_message', { count: registrations.length })}
        </Typography>
      </ConfirmDialog>
    </section>
  );
};
