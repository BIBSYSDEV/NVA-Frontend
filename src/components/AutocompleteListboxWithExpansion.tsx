import ExpandMore from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import { HTMLProps, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';

export interface AutocompleteListboxWithExpansionProps extends HTMLProps<HTMLUListElement> {
  hasMoreHits?: boolean;
  onShowMoreHits?: () => void;
  isLoadingMoreHits?: boolean;
}

export const AutocompleteListboxWithExpansion = forwardRef<HTMLUListElement, AutocompleteListboxWithExpansionProps>(
  function ListboxComponentWithExpansion(props, ref) {
    const { children, hasMoreHits, onShowMoreHits, isLoadingMoreHits, ...other } = props;
    const { t } = useTranslation();

    return (
      <ul {...other} ref={ref}>
        {children}
        {hasMoreHits && (
          <li>
            <LoadingButton
              data-testid={dataTestId.common.showMoreButton}
              sx={{ mt: '0.5rem', width: '100%' }}
              endIcon={<ExpandMore />}
              loading={isLoadingMoreHits}
              onClick={onShowMoreHits}>
              {t('common.show_more')}
            </LoadingButton>
          </li>
        )}
      </ul>
    );
  }
);
