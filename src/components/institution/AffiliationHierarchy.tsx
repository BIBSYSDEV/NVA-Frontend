import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { getOrganizationHierarchy } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { Organization, RecursiveInstitutionUnit } from '../../types/institution.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy = (props: AffiliationHierarchyProps) => {
  const { t } = useTranslation('feedback');
  const [organization, isLoadingOrganization] = useFetch<Organization>({
    url: props.unitUri,
    errorMessage: t('error.get_institution'),
  });
  const unitNames = getOrganizationHierarchy(organization).map((unit) => getLanguageString(unit.name));

  return (
    <AffiliationHierarchyRender
      {...props}
      isLoading={isLoadingOrganization}
      unitNames={unitNames}
      department={organization}
    />
  );
};

interface AffiliationHierarchyRenderProps extends AffiliationHierarchyProps {
  isLoading: boolean;
  unitNames: string[];
  department?: Organization | RecursiveInstitutionUnit;
}

const AffiliationHierarchyRender = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
  isLoading,
  department,
  unitNames,
}: AffiliationHierarchyRenderProps) => {
  const { t } = useTranslation('feedback');

  return isLoading ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : department ? (
    commaSeparated ? (
      <i>
        <Typography>{unitNames.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {unitNames.map((unitName, index) =>
          index === 0 && boldTopLevel ? (
            <Typography sx={{ fontWeight: 'bold' }} key={unitName + index}>
              {unitName}
            </Typography>
          ) : (
            <Typography key={unitName + index}>{unitName}</Typography>
          )
        )}
      </div>
    )
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
