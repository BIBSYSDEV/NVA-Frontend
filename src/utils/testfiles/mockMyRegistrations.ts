import { MyRegistrationsResponse } from '../../types/registration.types';

export const mockMyRegistrations: MyRegistrationsResponse = {
  publications: [
    {
      identifier: '12345678',
      mainTitle:
        'A longitudinal analysis of estimation, counting skills, and mathematical ability across the first school year.',
      createdDate: '1941-04-25',
      status: 'DRAFT',
      owner: 'kare@unit.no',
      contributors: [],
    },
    {
      identifier: '4327439',
      mainTitle:
        "Relationships between number line estimation, counting, and mathematical abilities. Ninety-nine 5-year-olds were tested on 4 occasions at 3 monthly intervals. Correlations between the 3 types of ability were evident, but while the quality of children's estimations changed over time and performance on the mathematical tasks improve.",
      createdDate: '2019-01-01',
      status: 'DRAFT',
      owner: 'kari@ntnu.no',
      contributors: [],
    },
    {
      identifier: '53453453',
      mainTitle: 'Potchefstroom electronic law journal : PER = Potchefstroomse elektroniese regsblad',
      createdDate: '2020-01-01',
      status: 'DRAFT',
      owner: 'arne@uio.no',
      contributors: [],
    },
    {
      identifier: '3333439',
      mainTitle: 'Attføring av attføringen : særlig om stoffmisbrukere : hedersskrift til Per Alveberg',
      createdDate: '2021-01-01',
      status: 'DRAFT_FOR_DELETION',
      owner: 'bob@boffaloe.com',
      contributors: [],
    },
    {
      identifier: '3533439',
      mainTitle: 'Attføring av attføringen : særlig om stoffmisbrukere : hedersskrift til Per Alveberg',
      createdDate: '2021-01-01',
      status: 'PUBLISHED',
      owner: 'bob@ryder.net',
      publicationDate: {
        type: 'PublicationDate',
        year: '2021',
        month: '01',
        day: '01',
      },
      contributors: [],
    },
    {
      identifier: '12345679',
      mainTitle:
        'A longitudinal analysis of estimation, counting skills, and mathematical ability across the first school year.',
      createdDate: '1941-04-25',
      status: 'PUBLISHED',
      owner: 'bob@maggio.com',
      publicationDate: { type: 'PublicationDate', year: '1941', month: '04', day: '25' },
      contributors: [],
    },
  ],
};
