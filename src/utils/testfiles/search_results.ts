import { SearchResult } from '../../types/search.types';
import { BackendTypeNames } from '../../types/publication_types/commonRegistration.types';

export const mockSearchResults: SearchResult = {
  took: 10,
  total: 50,
  hits: [
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/32290378-373e-4cca-8f24-d02b92d845ce',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2017',
        month: '8',
        day: '26',
      },
      title: 'Dove, The',
      owner: 'mfalvey0@pen.io',
      contributors: [
        {
          id: '04bfdced-e65a-483f-bcaa-a83ad7218b60',
          name: 'Alasdair Dyter',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/d90f87c9-fb5b-41ef-8575-584b50102476',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '8',
        day: '21',
      },
      title: 'Bad Santa',
      owner: 'fhanwell1@businessweek.com',
      contributors: [
        {
          id: '9022e8b1-e908-4b22-b051-c62ff4dc7854',
          name: 'Ailene Strippling',
        },
        {
          id: '8c9a8043-b110-4597-bf40-a6183d9a0c01',
          name: 'Kirstyn Jenik',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/c01b4fe3-bd3c-4b89-8d3a-4cced90a53e6',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2009',
        month: '8',
        day: '26',
      },
      title: 'Carey Treatment, The',
      owner: 'okobsch2@a8.net',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/989047e8-643e-4b31-b16a-915d5124cc25',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '26',
      },
      title: 'Gloria',
      owner: 'jjanusik3@timesonline.co.uk',
      contributors: [
        {
          id: '09a2d886-f7ee-4572-99f1-09e13de9a230',
          name: 'Llewellyn Munn',
        },
        {
          id: 'd2c86a47-39f2-451a-b4a9-57c2d187e1e7',
          name: 'Elisabetta Dulany',
        },
        {
          id: '99eb9c7a-021f-410b-8b4e-ac877dc29962',
          name: 'Derby Budd',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/79333552-6646-4497-ac28-845126fd96ed',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '9',
        day: '16',
      },
      title: 'Before and After',
      owner: 'zmilam4@smh.com.au',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/73772750-68a0-40f7-9adc-19d38e067f1a',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '9',
        day: '16',
      },
      title: 'Highlander',
      owner: 'bmangan5@soundcloud.com',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/181f6090-c20d-4f6e-ada4-184c22bb9a5d',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '16',
      },
      title: "Nim's Island",
      owner: 'vspafford6@google.ru',
      contributors: [
        {
          id: 'ea5b86dc-a6f2-4bb9-9dfe-7d0666421d69',
          name: 'Ianthe Becaris',
        },
        {
          id: 'e88e4a36-28e9-4ee4-bc7a-bf730d4dc2d6',
          name: 'Lou Wheal',
        },
        {
          id: '6f482d15-a9dd-4aa9-8255-e0c7222cc1ec',
          name: 'Tabbie Wagerfield',
        },
        {
          id: '262087ea-b96a-4232-8383-c97334013cec',
          name: 'Kylie Kausche',
        },
        {
          id: '23600318-eac9-46cb-af29-7156df9aebc8',
          name: 'Harrietta Fisby',
        },
        {
          id: 'ef690909-d71e-43a9-9fd4-eb99e8066f45',
          name: 'Jaquith Bescoby',
        },
        {
          id: '88305edf-e55e-4c0d-86c1-a81f83eec22d',
          name: 'Isac Robson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/87e92ce7-c401-4952-92fb-5028907a9c0e',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2009',
        month: '9',
        day: '16',
      },
      title: 'First Nudie Musical, The',
      owner: 'dspatoni7@t.co',
      contributors: [
        {
          id: 'a2a087a6-8de0-4a21-b026-faa629fb816d',
          name: 'Benji Rodrigo',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/52e144b4-e896-48c7-bf68-b3c051db5c58',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '3',
        day: '16',
      },
      title: 'Stavisky...',
      owner: 'mspreadbury8@ocn.ne.jp',
      contributors: [
        {
          id: '86ddca94-6c40-4eaa-b59e-33c4b340b9be',
          name: 'Quintina Whiston',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/36e16624-b92f-416e-830f-bda598e047ab',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '9',
        day: '12',
      },
      title: 'Powerpuff Girls, The',
      owner: 'jfarryan9@ucla.edu',
      contributors: [
        {
          id: '86ddca94-6c40-4eaa-b59e-33c4b340b9be',
          name: 'Wuintinas Whir',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/ed863357-3203-48e7-92bc-c8998843d366',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '2',
        day: '16',
      },
      title: 'Invisible Ray, The',
      owner: 'bskilletta@guardian.co.uk',
      contributors: [
        {
          id: '4d5f1550-e8c2-43a2-a62e-7f908626f0b4',
          name: 'Zsazsa Mizzi',
        },
        {
          id: '4bb7f444-2698-4085-9560-eefbafb4604e',
          name: 'Joey Larway',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/fc506676-0def-49f9-8d5d-de409956ad06',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '9',
        day: '16',
      },
      title: 'Cinderella Man',
      owner: 'sphizackleab@slate.com',
      contributors: [
        {
          id: '0911b70e-e9dd-44a5-acd9-2277f6f338b2',
          name: 'Nolie Aggett',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/a6d5a4ba-685c-43fd-b2e2-7b2eba8f6288',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '1',
        day: '16',
      },
      title: "I Killed My Mother (J'ai tué ma mère)",
      owner: 'mlowdhamc@ucsd.edu',
      contributors: [
        {
          id: 'e3e2409e-ca34-45c9-9631-e8926bcaf6f0',
          name: 'Burgess Bradnam',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/8987043b-67b9-4e46-9717-013c6134654d',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '1',
        day: '1',
      },
      title: 'Traveler, The',
      owner: 'opevied@ning.com',
      contributors: [
        {
          id: 'a62f53c9-42f2-446c-b2da-5afbd80bd672',
          name: 'Bernardo Hurdwell',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/0dd27154-42a2-4147-aef1-aaa70c065d28',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '1',
        day: '10',
      },
      title: 'Frankenweenie',
      owner: 'rmacoune@nsw.gov.au',
      contributors: [
        {
          id: '8fae654c-89b8-4d64-9681-641e63b39e48',
          name: 'Anny Mandrier',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/5c0e1784-1530-41c3-8b5f-8bf8f4572f3a',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '1',
        day: '1',
      },
      title: 'And Life Goes On (a.k.a. Life and Nothing More) (Zendegi va digar hich)',
      owner: 'hjurekf@apple.com',
      contributors: [
        {
          id: '11da2df8-f48b-4169-8dbd-25a971ce891c',
          name: 'Bruno Deabill',
        },
        {
          id: '379ac4ee-f74c-417d-927c-4355b34c8ec9',
          name: 'Andy Edgehill',
        },
        {
          id: 'b3ae69f4-c77b-4678-87fb-51e1da37c070',
          name: 'Cecile Surmon',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/c5f3f0e9-e48e-4215-b826-03f61790aea0',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '12',
        day: '1',
      },
      title: 'Generation Iron',
      owner: 'mandreuzzig@imgur.com',
      contributors: [
        {
          id: '88b832c4-5d45-4e3f-81de-82530ad8f389',
          name: 'Brent Regus',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/6f82edac-6bce-4e2b-adbe-46707482ac04',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '1',
        day: '12',
      },
      title: 'Sunshine State',
      owner: 'achurmsh@networksolutions.com',
      contributors: [
        {
          id: 'a9a34fb7-efc8-44a0-9727-e7ebb458931f',
          name: 'Abran Buzin',
        },
        {
          id: '29575acf-6d85-49fc-8f6c-8de1bbe24aa9',
          name: 'Ennis Knapman',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/a20c371f-3569-4bc1-bd3f-35a598bdcdfc',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '10',
        day: '1',
      },
      title: 'Kapò',
      owner: 'kmasseoi@yahoo.co.jp',
      contributors: [
        {
          id: 'd1578023-4e8e-4e2c-9d4e-7011e936ab4b',
          name: 'Francesca Blaxill',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/e8c16926-eb52-418d-8b54-887943347dbb',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '3',
        day: '1',
      },
      title: 'Message to Love: The Isle of Wight Festival',
      owner: 'ashropshirej@slate.com',
      contributors: [
        {
          id: '43394bb6-a9a6-4c44-8106-a77866bc8fd4',
          name: 'Rudolph Trivett',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/ea8bc8c1-04dd-4449-b5cb-78c071bcfa9c',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '10',
        day: '12',
      },
      title: 'News from Home',
      owner: 'agooderedk@cbsnews.com',
      contributors: [
        {
          id: 'b4db55ea-eb2d-4421-9327-43b73a08e3a3',
          name: 'Maxi Morsom',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/e3bdb056-289b-4430-b21e-ff944e57ebcb',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '9',
        day: '10',
      },
      title: 'Journey from the Fall',
      owner: 'emateul@joomla.org',
      contributors: [
        {
          id: '1e089b09-40c9-4e40-9a45-37de290911a2',
          name: 'Sal Aspenlon',
        },
        {
          id: '324b1262-5139-4278-abae-869d5fa24561',
          name: 'Joannes Shambroke',
        },
        {
          id: '4fffb939-7506-4ba2-82e5-981b0b7ed428',
          name: 'Benjamin Bowering',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/a5fd5ac7-cbda-4a17-b885-db9e159e3acb',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '9',
        day: '10',
      },
      title: 'Daughters of Darkness (Les lèvres rouges)',
      owner: 'cacomm@wufoo.com',
      contributors: [
        {
          id: '28586c67-19f9-4cee-bfea-5a057384b6e6',
          name: 'Cristi Wadwell',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/bb3ed33b-082e-461a-9001-9d2276d1bf79',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '11',
        day: '10',
      },
      title: 'Stella',
      owner: 'wfouracren@shareasale.com',
      contributors: [
        {
          id: 'ec6fd020-9550-4815-9811-c6a9c2c80a12',
          name: 'Curtis Fitch',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/7595f84d-2f4e-40a5-84a1-59a5ff8d9bcf',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '9',
        day: '10',
      },
      title: 'Virus',
      owner: 'jpimbleyo@cornell.edu',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
        {
          id: 'fa7bd88d-ef62-4380-8fd2-3fec7cf06aff',
          name: 'Christoffer Blakden',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/95c6b281-6dd8-4525-80bf-b6d7127ab92d',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '9',
        day: '25',
      },
      title: 'Hum Tumhare Hain Sanam',
      owner: 'sdarycottp@123-reg.co.uk',
      contributors: [
        {
          id: '7f8dbf13-5588-4d99-8b0b-7ecbd1d5064b',
          name: 'Sharyl Nickoles',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/b72315bf-92ed-4626-81ea-8fd2aabd48ef',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '12',
        day: '10',
      },
      title: 'Closing the Ring',
      owner: 'scohrsq@chronoengine.com',
      contributors: [
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/70d340e5-448c-40a7-a80d-3630e4a7872c',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2017',
        month: '9',
        day: '10',
      },
      title: 'Road to Hong Kong, The',
      owner: 'mschiellr@typepad.com',
      contributors: [
        {
          id: '4e8fe5ba-fa4d-44c5-b6f0-1adf6ff46c8e',
          name: 'Amery Roskams',
        },
        {
          id: '698357d8-c588-4e77-b9be-630fcae74d45',
          name: 'Giacomo Bleacher',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/d66d4683-6bdc-4732-bee2-189fbe7404d3',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '9',
        day: '10',
      },
      title: 'City in the Sea',
      owner: 'wmanuelys@rakuten.co.jp',
      contributors: [
        {
          id: 'a14b3554-6cd4-4581-a6da-925d58008a4c',
          name: 'Tami Askam',
        },
        {
          id: '0e6ed2e2-5384-4880-8063-d3982de53033',
          name: 'Heath Greensitt',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/661fd539-3c20-4764-bfc2-009e9cfb043c',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '9',
        day: '10',
      },
      title: 'Black Mirror',
      owner: 'bisacssont@princeton.edu',
      contributors: [
        {
          id: '1aa709b5-27a8-4ee0-ad51-4400007f977f',
          name: 'Huberto McParland',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/8559da5f-9d24-4004-ae30-f43f9ef35b1d',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '5',
        day: '10',
      },
      title: 'Ambush Trail',
      owner: 'ddjorevicu@psu.edu',
      contributors: [
        {
          id: 'd7c2ee83-39f0-4f6d-8ffb-02cfadae688f',
          name: 'Hendrick Shawe',
        },
        {
          id: '8a57bd4c-630f-415c-bd8a-d2ebd8d089d2',
          name: 'Dorene Ellens',
        },
        {
          id: 'd0186ef1-6f99-4cd7-a5c6-d52e1f9f9ea7',
          name: 'Butch Izak',
        },
        {
          id: '241383c0-94e6-41cd-a9ab-32172bcbc231',
          name: 'Darby Mengo',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/40a06c82-063d-4c14-945c-17424cc09a77',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '5',
        day: '6',
      },
      title: 'Another You',
      owner: 'klovejoyv@csmonitor.com',
      contributors: [
        {
          id: 'b2279393-0c1a-4943-a76c-bcc9b2982745',
          name: 'Jenica Pallant',
        },
        {
          id: '135621ef-8c86-4d20-b1f3-43574c919695',
          name: 'Avrit Knowlson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/fa37540a-ef9f-4e07-91a7-dfd2a3fca2db',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '5',
        day: '6',
      },
      title: 'Moonlight Serenade',
      owner: 'tshentonw@house.gov',
      contributors: [
        {
          id: '135621ef-8c86-4d20-b1f3-43574c919695',
          name: 'Avrit Knowlson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/9c35a95d-42c7-44e8-81f9-b99ecb5a4d44',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2017',
        month: '5',
        day: '6',
      },
      title: 'Sammy and Rosie Get Laid',
      owner: 'msharplyx@smugmug.com',
      contributors: [
        {
          id: '135621ef-8c86-4d20-b1f3-43574c919695',
          name: 'Avrit Knowlson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/75cbe42d-e72e-4931-96fd-9dc5ee45bfe9',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '5',
        day: '6',
      },
      title: 'Why Are the Bells Ringing, Mitica? (a.k.a. Carnival Scenes) (De ce trag clopotele, Mitica?)',
      owner: 'jodesony@squidoo.com',
      contributors: [
        {
          id: '135621ef-8c86-4d20-b1f3-43574c919695',
          name: 'Avrit Knowlson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/f8ff4270-d888-4b0b-8f26-c770e6534f4b',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '2',
        day: '6',
      },
      title: 'Trust Us, This Is All Made Up',
      owner: 'asaggsz@cmu.edu',
      contributors: [
        {
          id: '135621ef-8c86-4d20-b1f3-43574c919695',
          name: 'Avrit Knowlson',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/f454a939-53e9-4a72-a9e2-bc6165f4fbb4',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '4',
        day: '6',
      },
      title: 'Post Grad',
      owner: 'cwieprecht10@blog.com',
      contributors: [
        {
          id: 'd7c2ee83-39f0-4f6d-8ffb-02cfadae688f',
          name: 'Hendrick Shawe',
        },
        {
          id: '8a57bd4c-630f-415c-bd8a-d2ebd8d089d2',
          name: 'Dorene Ellens',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/509c09f6-9bb2-4bdc-b1af-c891f32d722f',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '5',
        day: '23',
      },
      title: 'Raiders of Atlantis, The',
      owner: 'edavy11@i2i.jp',
      contributors: [
        {
          id: 'd7c2ee83-39f0-4f6d-8ffb-02cfadae688f',
          name: 'Hendrick Shawe',
        },
        {
          id: '8a57bd4c-630f-415c-bd8a-d2ebd8d089d2',
          name: 'Dorene Ellens',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/da0a70b5-2a84-4edc-8fc4-2899bda7b7b0',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '5',
        day: '25',
      },
      title: 'Descendants, The',
      owner: 'dcathcart12@bizjournals.com',
      contributors: [
        {
          id: 'd7c2ee83-39f0-4f6d-8ffb-02cfadae688f',
          name: 'Hendrick Shawe',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/2954cbf7-e012-479e-938a-cc01b9b8c366',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '7',
        day: '6',
      },
      title: 'Royal Scandal, A',
      owner: 'kbrimacombe13@prnewswire.com',
      contributors: [
        {
          id: 'd7c2ee83-39f0-4f6d-8ffb-02cfadae688f',
          name: 'Hendrick Shawe',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/7e1c7b58-4033-455c-b7e4-92c212f0145c',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '8',
        day: '6',
      },
      title: 'Major Dundee',
      owner: 'tgrimsdell14@flavors.me',
      contributors: [
        {
          id: '8a57bd4c-630f-415c-bd8a-d2ebd8d089d2',
          name: 'Dorene Ellens',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/6fe76bdb-0277-433d-b174-daa3d61bf704',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2020',
        month: '5',
        day: '26',
      },
      title: 'Renoir',
      owner: 'mwonfor15@dell.com',
      contributors: [
        {
          id: '8a57bd4c-630f-415c-bd8a-d2ebd8d089d2',
          name: 'Dorene Ellens',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/f79a5f01-fc81-45e8-907b-95cf1fd309a5',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '5',
        day: '26',
      },
      title: 'Sexual Life of the Belgians, The (Vie sexuelle des Belges 1950-1978, La)',
      owner: 'ceveritt16@google.es',
      contributors: [
        {
          id: '7f8dbf13-5588-4d99-8b0b-7ecbd1d5064b',
          name: 'Sharyl Nickoles',
        },
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
        {
          id: '4e8fe5ba-fa4d-44c5-b6f0-1adf6ff46c8e',
          name: 'Amery Roskams',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/5d1b0915-46c6-432a-9cf5-0fd14cfea3bc',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2018',
        month: '5',
        day: '26',
      },
      title: 'Lineup, The',
      owner: 'lbarniss17@slate.com',
      contributors: [
        {
          id: '7f8dbf13-5588-4d99-8b0b-7ecbd1d5064b',
          name: 'Sharyl Nickoles',
        },
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
        {
          id: '4e8fe5ba-fa4d-44c5-b6f0-1adf6ff46c8e',
          name: 'Amery Roskams',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/2bd86ec1-2b83-4da4-9ae8-86dfb59e514d',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2017',
        month: '5',
        day: '26',
      },
      title: 'Julie & Julia',
      owner: 'dgawthrop18@bloglovin.com',
      contributors: [
        {
          id: '7f8dbf13-5588-4d99-8b0b-7ecbd1d5064b',
          name: 'Sharyl Nickoles',
        },
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/e441ebea-5268-48a0-b749-663fa35912af',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '26',
      },
      title: 'Stray Dog (Nora inu)',
      owner: 'pfiggs19@photobucket.com',
      contributors: [
        {
          id: '7f8dbf13-5588-4d99-8b0b-7ecbd1d5064b',
          name: 'Sharyl Nickoles',
        },
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/088e4e74-ab76-4eb3-b7ad-abaee07b0d67',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '20',
      },
      title: 'Adventures of Ford Fairlane, The',
      owner: 'sumpleby1a@webnode.com',
      contributors: [
        {
          id: '43849abf-d9e7-4532-a35d-cdd3bc704edd',
          name: 'Brittni Sebire',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/bbf1ddd5-a529-424b-bf6d-6a75434e6fc5',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '2',
      },
      title: 'Point Blank (À bout portant)',
      owner: 'jpantlin1b@abc.net.au',
      contributors: [
        {
          id: 'ec6fd020-9550-4815-9811-c6a9c2c80a12',
          name: 'Curtis Fitch',
        },
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/22ba6c5b-dea8-48d9-95f2-3eec4a987522',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '12',
      },
      title: 'Warrior',
      owner: 'bkeel1c@whitehouse.gov',
      contributors: [
        {
          id: 'ec6fd020-9550-4815-9811-c6a9c2c80a12',
          name: 'Curtis Fitch',
        },
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
    {
      id: 'https://frontend.dev.nva.aws.unit.no/publication/1fc1084b-ea80-4ace-9faa-7f719a184cdd',
      publicationDate: {
        type: BackendTypeNames.INDEX_DATE,
        year: '2019',
        month: '10',
        day: '22',
      },
      title: 'Clubbed',
      owner: 'hbowmaker1d@independent.co.uk',
      contributors: [
        {
          id: 'eb918407-16fb-44e1-a1ac-32a7837d1f59',
          name: 'Alberto Kuzma',
        },
      ],
      publicationType: 'JournalArticle',
      publisher: {
        id: 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
      },
    },
  ],
};
