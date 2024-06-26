import { MyRegistrationsResponse, RegistrationStatus } from '../../types/registration.types';

export const mockMyRegistrations: MyRegistrationsResponse = {
  publications: [
    {
      abstract:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum velit tellus, bibendum id diam vel, mattis dictum sem. Vivamus condimentum urna a vehicula pharetra. Cras fermentum quam a ligula ultrices mollis. Donec dapibus leo quis leo tincidunt, sit amet dignissim diam vehicula. In vel malesuada quam. Sed lacinia justo non odio viverra, non accumsan nisl pharetra. Cras et ultricies velit.',
      contributors: [],
      identifier: '12345678',
      id: 'https://nva.no/publication/12345678',
      mainTitle:
        'A longitudinal analysis of estimation, counting skills, and mathematical ability across the first school year.',
      createdDate: '2000-01-01',
      modifiedDate: '2021-01-01',
      status: RegistrationStatus.Draft,
      owner: 'kare@unit.no',
    },
    {
      abstract:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum velit tellus, bibendum id diam vel, mattis dictum sem. Vivamus condimentum urna a vehicula pharetra. Cras fermentum quam a ligula ultrices mollis. Donec dapibus leo quis leo tincidunt, sit amet dignissim diam vehicula. In vel malesuada quam. Sed lacinia justo non odio viverra, non accumsan nisl pharetra. Cras et ultricies velit.',
      contributors: [],
      identifier: '4327439',
      id: 'https://nva.no/publication/4327439',
      mainTitle:
        "Relationships between number line estimation, counting, and mathematical abilities. Ninety-nine 5-year-olds were tested on 4 occasions at 3 monthly intervals. Correlations between the 3 types of ability were evident, but while the quality of children's estimations changed over time and performance on the mathematical tasks improve.",
      createdDate: '2019-01-01',
      modifiedDate: '2019-01-01',
      status: RegistrationStatus.Draft,
      owner: 'kari@ntnu.no',
    },
    {
      abstract: '',
      contributors: [],
      identifier: '53453453',
      id: 'https://nva.no/publication/53453453',
      mainTitle: 'Potchefstroom electronic law journal : PER = Potchefstroomse elektroniese regsblad',
      createdDate: '2020-01-01',
      modifiedDate: '2020-01-01',
      status: RegistrationStatus.Draft,
      owner: 'arne@uio.no',
    },
    {
      abstract:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum velit tellus, bibendum id diam vel, mattis dictum sem. Vivamus condimentum urna a vehicula pharetra. Cras fermentum quam a ligula ultrices mollis. Donec dapibus leo quis leo tincidunt, sit amet dignissim diam vehicula. In vel malesuada quam. Sed lacinia justo non odio viverra, non accumsan nisl pharetra. Cras et ultricies velit.',
      contributors: [],
      identifier: '3333439',
      id: 'https://nva.no/publication/3333439',
      mainTitle: 'Attføring av attføringen : særlig om stoffmisbrukere : hedersskrift til Per Alveberg',
      createdDate: '2021-01-01',
      modifiedDate: '2021-01-01',
      status: RegistrationStatus.Draft,
      owner: 'bob@boffaloe.com',
    },
    {
      abstract: '',
      contributors: [],
      identifier: '3533439',
      id: 'https://nva.no/publication/3533439',
      mainTitle: 'Attføring av attføringen : særlig om stoffmisbrukere : hedersskrift til Per Alveberg',
      createdDate: '2021-01-01',
      modifiedDate: '2021-01-01',
      status: RegistrationStatus.Published,
      owner: 'bob@ryder.net',
    },
    {
      abstract: '',
      contributors: [],
      identifier: '12345679',
      id: 'https://nva.no/publication/12345679',
      mainTitle:
        'A longitudinal analysis of estimation, counting skills, and mathematical ability across the first school year.',
      createdDate: '2010-04-10',
      modifiedDate: '2021-01-01',
      status: RegistrationStatus.Published,
      owner: 'bob@maggio.com',
    },
  ],
};
