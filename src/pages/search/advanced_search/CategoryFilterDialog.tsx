import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam, TicketSearchParam } from '../../../api/searchApi';
import { CategorySelector } from '../../../components/CategorySelector';
import { PublicationInstanceType } from '../../../types/registration.types';

interface CategoryFilterDialogProps {
  open: boolean;
  currentCategories: PublicationInstanceType[];
  closeDialog: () => void;
  searchParam: ResultParam | TicketSearchParam;
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
            const newCategoryShould = selectedCategories.join(',');
            if (newCategoryShould) {
              params.set(searchParam, newCategoryShould);
            } else {
              params.delete(searchParam);
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
