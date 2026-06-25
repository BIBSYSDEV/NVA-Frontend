import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListSubheader } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ShowMoreDropdownItemsButtonProps {
  showAll: boolean;
  onExpand: () => void;
  dataTestId?: string;
}

export const ShowMoreDropdownItemsButton = ({ showAll, onExpand, dataTestId }: ShowMoreDropdownItemsButtonProps) => {
  const { t } = useTranslation();

  return (
    <ListSubheader
      disableSticky
      role="button"
      tabIndex={0}
      data-testid={dataTestId}
      onMouseDown={(e) => {
        e.preventDefault();
        onExpand();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onExpand();
        }
      }}
      sx={{
        cursor: 'pointer',
        color: 'primary.main',
        display: showAll ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {t('common.show_more')}
      <ExpandMoreIcon aria-hidden="true" />
    </ListSubheader>
  );
};
