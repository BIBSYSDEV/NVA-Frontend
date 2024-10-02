import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam, TicketSearchParam } from '../../../api/searchApi';
import { CategorySelector } from '../../../components/CategorySelector';
import { PublicationInstanceType } from '../../../types/registration.types';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

interface CategoryFilterDialogProps {
  open: boolean;
  currentCategories: PublicationInstanceType[];
  closeDialog: () => void;
  searchParam: ResultParam.CategoryShould | TicketSearchParam.PublicationType;
}

export const CategoryFilterDialog = ({
  open,
  currentCategories,
  closeDialog,
  searchParam,
}: CategoryFilterDialogProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedCategories, setSelectedCategories] = useState(currentCategories);

  const onSelectType = (type: PublicationInstanceType) => {
    if (selectedCategories.includes(type)) {
      setSelectedCategories(selectedCategories.filter((category) => category !== type));
    } else {
      setSelectedCategories([...selectedCategories, type]);
    }
  };

  // Used to clear value from parent component
  useEffect(() => {
    setSelectedCategories(currentCategories);
  }, [currentCategories]);

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{t('search.select_one_or_more_categories')}</DialogTitle>
      <DialogContent>
        <CategorySelector
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onCategoryClick={onSelectType}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>{t('common.cancel')}</Button>
        <Button disabled={selectedCategories.length === 0} onClick={() => setSelectedCategories([])}>
          {t('search.reset_selection')}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const params = new URLSearchParams(history.location.search);
            const syncedParams = syncParamsWithSearchFields(params);
            const newCategoryShould = selectedCategories.join(',');
            if (newCategoryShould) {
              syncedParams.set(searchParam, newCategoryShould);
            } else {
              syncedParams.delete(searchParam);
            }
            syncedParams.delete(ResultParam.From);

            history.push({ search: syncedParams.toString() });
            closeDialog();
          }}>
          {t('common.use')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
