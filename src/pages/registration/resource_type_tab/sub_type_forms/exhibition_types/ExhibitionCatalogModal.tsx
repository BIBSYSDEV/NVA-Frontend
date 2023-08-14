import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../translations/i18n';
import { BookType } from '../../../../../types/publicationFieldNames';
import { ExhibitionCatalog } from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { SearchContainerField } from '../../components/SearchContainerField';
import { OutputModalActions } from '../artistic_types/OutputModalActions';

interface ExhibitionCatalogModalProps {
  exhibitionCatalog?: ExhibitionCatalog;
  onSubmit: (exhibitionCatalog: ExhibitionCatalog) => void;
  open: boolean;
  closeModal: () => void;
}

const validationSchema = Yup.object({
  id: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.publication_types.ExhibitionCatalog'),
    })
  ),
});

const emptyExhibitionCatalog: ExhibitionCatalog = {
  type: 'ExhibitionCatalog',
  id: '',
};

export const ExhibitionCatalogModal = ({
  exhibitionCatalog,
  onSubmit,
  open,
  closeModal,
}: ExhibitionCatalogModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {exhibitionCatalog
          ? t('registration.resource_type.exhibition_production.edit_exhibition_catalog')
          : t('registration.resource_type.exhibition_production.add_exhibition_catalog')}
      </DialogTitle>
      <Formik
        initialValues={exhibitionCatalog ?? emptyExhibitionCatalog}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<ExhibitionCatalog>) => (
          <Form noValidate>
            <DialogContent>
              <SearchContainerField
                fieldName="id"
                searchSubtypes={[BookType.ExhibitionCatalog]}
                label={t('registration.publication_types.ExhibitionCatalog')}
                placeholder={t('registration.resource_type.exhibition_production.search_for_exhibition_catalog')}
                dataTestId={dataTestId.registrationWizard.resourceType.exhibitionCatalogSearchField}
                fetchErrorMessage={t('feedback.error.search')}
              />
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!exhibitionCatalog} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
