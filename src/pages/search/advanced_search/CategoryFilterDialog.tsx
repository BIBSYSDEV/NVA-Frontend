import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { CategorySelector } from '../../../components/CategorySelector';
import { PublicationInstanceType } from '../../../types/registration.types';

interface CategoryFilterDialogProps {
  open: boolean;
  currentCategories: PublicationInstanceType[];
  closeDialog: () => void;
}

export const CategoryFilterDialog = ({ open, currentCategories, closeDialog }: CategoryFilterDialogProps) => {
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
          enableNviHighlightning={true}
          selectedCategories={selectedCategories}
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
            const newCategoryShould = selectedCategories.join(',');
            if (newCategoryShould) {
              params.set(ResultParam.CategoryShould, newCategoryShould);
            } else {
              params.delete(ResultParam.CategoryShould);
            }
            params.set(ResultParam.From, '0');
            history.push({ search: params.toString() });
            closeDialog();
          }}>
          {t('common.use')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
