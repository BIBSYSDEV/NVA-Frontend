import { RecursiveInstitutionUnit } from '../../../types/institution.types';

export const mockSchoolOfSportDepartment: RecursiveInstitutionUnit = {
  id: 'https://api.cristin.no/v2/units/150.0.0.0',
  name: 'Norwegian School of Sport Sciences',
  subunits: [
    {
      id: 'https://api.cristin.no/v2/units/150.4.0.0',
      name: 'Department for Research Management and Documentation',
      subunits: [
        {
          id: 'https://api.cristin.no/v2/units/150.4.1.0',
          name: 'Library',
        },
      ],
    },
  ],
};
