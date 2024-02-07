import { Registration } from '../../../types/registration.types';
import { Box, Breadcrumbs, Button, DialogActions, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FindRegistration } from './FindRegistration';

interface DeleteForm {
  deleteMessage: string;
  duplicateOfUri: string;
  searchDuplicate: string;
}

interface DeletePublicationProps {
  registration: Registration;
  refetchData: () => void;
}

const deleteValidationSchema = Yup.object().shape({
  deleteMessage: Yup.string().min(3, 'Begrunnelsen må minst være på 3 tegn').required('Begrunnelse er påkrevt'),
  duplicateOfUri: Yup.string().url(),
  searchDuplicate: Yup.string(),
});

export const DeletePublication = ({ registration, refetchData }: DeletePublicationProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration | null>(null);

  const handleDelete = (values: DeleteForm) => {
    console.log('submitting');
    //contact api
    setShowDeleteModal(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
        <Divider />
        <Breadcrumbs
          sx={{ alignSelf: 'center' }}
          itemsBeforeCollapse={0}
          itemsAfterCollapse={0}
          maxItems={0}
          aria-label={'vis flere valg'}>
          <Button data-testid={'open delete modal'} variant="outlined" onClick={() => setShowDeleteModal(true)}>
            Slette
          </Button>
        </Breadcrumbs>
      </Box>
      <Modal
        dataTestId={'delete modal'}
        headingText={'Slette resultat'}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Box>
            <Typography variant="caption">* Felt med stjerne er obligatorisk</Typography>
          </Box>
          <Box sx={{ gap: '1rem' }}>
            <Typography variant="h3">Avpubliser forskningsresultat</Typography>
            <Typography>
              Ved avpublisering vil ikke forskningsresultatet være søkbare i NVA, men vil fortsatt være tilgjengelige
              ved oppslag av referanse.
            </Typography>
            <Typography>
              Eventuelle filer vil fjernes fra forskningsresultatet av avpublisering, men blir ikke permanent slettet.
            </Typography>
          </Box>

          <Formik
            initialValues={{
              deleteMessage: '',
              duplicateOfUri: '',
              searchDuplicate: '',
            }}
            validationSchema={deleteValidationSchema}
            onSubmit={(values, formikHelpers) => {
              handleDelete(values);
            }}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ my: '1rem' }}>
                  <Typography variant="h3">Er dette en feilregistrering?</Typography>
                  <Typography gutterBottom={true}>
                    Legg inn en kort begrunnelse for at dette forskningsresultatet ikke lenger skal være publisert.
                    Begrunnelsen vil vises på forskningsresultatet ved oppslag av referanse til forskningsresultet.
                  </Typography>
                  <TextField
                    variant="filled"
                    fullWidth
                    id="deleteMessageId"
                    name="deleteMessage"
                    label={'Begrunnelse'}
                    placeholder={'skriv inn'}
                    required={true}
                    value={values.deleteMessage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.deleteMessage && Boolean(errors.deleteMessage)}
                    helperText={touched.deleteMessage && errors.deleteMessage}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
                  <Box sx={{ gap: '1rem' }}>
                    <Typography variant="h3">
                      Finnes det en annen publisert versjon av samme forskningsresultat?
                    </Typography>
                    <Typography>
                      For at alle siteringer skal bli videreført, må du søke opp den andre registreringen. Da vil alle
                      siteringer fortsatt føre til den andre versjonen
                    </Typography>
                  </Box>
                </Box>
                <FindRegistration
                  setSelectedRegistration={setSelectedDuplicate}
                  selectedRegistration={selectedDuplicate}
                  filteredRegistrationIdentifier={registration.identifier}
                />
                <DialogActions>
                  <Button data-testid={'close delete modal'} onClick={() => setShowDeleteModal(false)}>
                    Angre
                  </Button>
                  <Button type="submit" data-testid={'delete-registration-button'} variant="outlined">
                    Lagre
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
