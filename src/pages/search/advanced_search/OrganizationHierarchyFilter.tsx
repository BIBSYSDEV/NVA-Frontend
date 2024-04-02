import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getAllChildOrganizations, getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface OrganizationHierarchyFilterProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  organization: Organization;
}

export const OrganizationHierarchyFilter = ({ organization, open, onClose }: OrganizationHierarchyFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const unitFromParams = params.get(ResultParam.Unit) ?? '';

  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState(unitFromParams);

  useEffect(() => {
    // Reset selection state when URL is updated elsewhere
    if (!unitFromParams) {
      setSelectedId('');
    }
  }, [unitFromParams]);

  const closeDialog = () => {
    onClose();
    setSearchId('');
  };

  const allSubUnits = getSortedSubUnits(organization.hasPart);

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
        setSelectedId(unitFromParams);
      }}
      maxWidth="lg"
      transitionDuration={0}>
      <DialogTitle>{t('common.select_unit')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: '2rem' }}>
          <Trans t={t} i18nKey="editor.institution.institution_helper_text">
            <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
          </Trans>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Autocomplete
            data-testid={dataTestId.editor.organizationOverviewSearchField}
            options={allSubUnits}
            inputMode="search"
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={(props, option) => <OrganizationRenderOption key={option.id} props={props} option={option} />}
            filterOptions={(options, state) =>
              options.filter(
                (option) =>
                  Object.values(option.labels).some((label) =>
                    label.toLowerCase().includes(state.inputValue.toLowerCase())
                  ) || getIdentifierFromId(option.id).includes(state.inputValue)
              )
            }
            getOptionKey={(option) => option.id}
            onChange={(_, selectedUnit) => setSearchId(selectedUnit?.id ?? '')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('search.search_for_sub_unit')} />
            )}
          />

          {organization.hasPart?.map((org) => (
            <OrganizationAccordion
              key={org.id}
              organization={org}
              searchId={searchId}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            closeDialog();
            setSelectedId(unitFromParams);
          }}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          disabled={!selectedId}
          onClick={() => {
            params.delete(ResultParam.From);
            params.set(ResultParam.Unit, selectedId);
            history.push({ search: params.toString() });
            closeDialog();
          }}>
          {t('common.select')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface OrganizationAccordionProps {
  organization: Organization;
  searchId: string;
  includeAllSubunits?: boolean;
  level?: number;
  selectedId: string;
  setSelectedId: (id: string) => void;
}

const OrganizationAccordion = ({
  organization,
  searchId,
  level = 0,
  includeAllSubunits = false,
  selectedId,
  setSelectedId,
}: OrganizationAccordionProps) => {
  const { t } = useTranslation();

  const isSearchedUnit = organization.id === searchId;
  const isSelectedUnit = organization.id === selectedId;

  const allSubunits = getAllChildOrganizations(organization.hasPart);

  const [expandedState, setExpandedState] = useState(
    isSelectedUnit || allSubunits.some((subunit) => subunit.id === selectedId)
  );

  if (!!searchId && !isSearchedUnit && !includeAllSubunits) {
    if (!allSubunits.some((subunit) => subunit.id === searchId)) {
      return null; // Hide this element if the searched ID is not a part of this unit
    }
  }

  const expanded = expandedState || (!!searchId && !includeAllSubunits);
  const subunitsCount = organization.hasPart?.length ?? 0;

  return (
    <Accordion
      data-testid={dataTestId.editor.organizationAccordion(organization.id)}
      elevation={2}
      disableGutters
      sx={{
        bgcolor: level % 2 === 0 ? 'secondary.main' : 'secondary.light',
        ml: { xs: undefined, md: level > 0 ? '1rem' : 0 },
      }}
      expanded={expanded}
      onChange={() => {
        setExpandedState(!expandedState);
        setSelectedId(organization.id);
      }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ visibility: subunitsCount > 0 ? null : 'hidden' }} />}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: '0.25rem 1rem',
            gridTemplateColumns: {
              xs: 'auto 1fr',
              lg: 'auto 3fr 3fr 1fr 1fr',
              alignItems: 'center',
            },
            py: '0.25rem',
            '& > p': { fontWeight: isSearchedUnit ? 700 : undefined },
          }}>
          {isSelectedUnit ? <RadioButtonCheckedIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
          <Typography>{getLanguageString(organization.labels, 'nb')}</Typography>
          <Typography sx={{ gridColumn: { xs: '1/3', lg: '3/4' } }}>{organization.labels['en']}</Typography>
          <Typography sx={{ gridColumn: { xs: '1/3', lg: '4/5' } }}>{getIdentifierFromId(organization.id)}</Typography>
          <Typography sx={{ gridColumn: { xs: '1/3', lg: '5/6' } }}>
            {subunitsCount > 0 && t('editor.subunits_count', { count: subunitsCount })}
          </Typography>
        </Box>
      </AccordionSummary>
      {subunitsCount > 0 && (
        <AccordionDetails sx={{ pr: 0 }}>
          {expanded &&
            organization.hasPart?.map((subunit) => (
              <OrganizationAccordion
                key={subunit.id}
                organization={subunit}
                level={level + 1}
                searchId={searchId}
                includeAllSubunits={includeAllSubunits || isSearchedUnit}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
};
