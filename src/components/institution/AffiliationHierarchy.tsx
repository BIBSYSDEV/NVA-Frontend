import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { getNewUnitHierarchy, getUnitHierarchyNames } from '../../utils/institutions-helpers';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { useFetchDepartment } from '../../utils/hooks/useFetchDepartment';
import { Organization } from '../../types/institution.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { getLanguageString } from '../../utils/translation-helpers';

interface AffiliationHierarchyProps {
  unitUri: string;
  commaSeparated?: boolean; // Comma separated or line breaks
  boldTopLevel?: boolean; // Only relevant if commaSeparated=false
}

export const AffiliationHierarchy = (props: AffiliationHierarchyProps) => {
  const isNewUri = !props.unitUri.includes('https://api.cristin.no/v2/');
  return isNewUri ? <NewAffiliationHierarchy {...props} /> : <OldAffiliationHierarchy {...props} />;
};

const NewAffiliationHierarchy = (props: AffiliationHierarchyProps) => {
  const [department, isLoadingDepartment] = useFetch<Organization>({ url: props.unitUri });
  const unitNames = getNewUnitHierarchy(department)
    .map((unit) => getLanguageString(unit.name))
    .reverse();

  return (
    <AffiliationHierarchyRender {...props} isLoading={isLoadingDepartment} names={unitNames} department={department} />
  );
};

const OldAffiliationHierarchy = (props: AffiliationHierarchyProps) => {
  const [department, isLoadingDepartment] = useFetchDepartment(props.unitUri);
  const unitHierarchyNames = getUnitHierarchyNames(props.unitUri, department);

  return (
    <AffiliationHierarchyRender
      {...props}
      isLoading={isLoadingDepartment}
      names={unitHierarchyNames}
      department={department}
    />
  );
};

interface AffiliationHierarchyRenderProps extends AffiliationHierarchyProps {
  isLoading: boolean;
  names: string[];
  department: any;
}

const AffiliationHierarchyRender = ({
  unitUri,
  commaSeparated = false,
  boldTopLevel = true,
  isLoading,
  department,
  names,
}: AffiliationHierarchyRenderProps) => {
  const { t } = useTranslation('feedback');

  return isLoading ? (
    <AffiliationSkeleton commaSeparated={commaSeparated} />
  ) : department ? (
    commaSeparated ? (
      <i>
        <Typography>{names.join(', ')}</Typography>
      </i>
    ) : (
      <div>
        {names.map((unitName, index) =>
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
