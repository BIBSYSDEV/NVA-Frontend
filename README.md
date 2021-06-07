# Nasjonalt Vitenarkiv Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment variables

To run this app, you need to add a set of environment variables to a `.env` file located at the root of the project folder (`/NVA-Frontend/.env`).

A minimal working example for `.env` that uses a simplistic set of (incomplete) mock data looks as follows:

```markdown
REACT_APP_API_URL=https://api.dev.nva.aws.unit.no
REACT_APP_USE_MOCK=true
```

Info about all environment variables are listed in the table below. Note that you must be authorized to retrieve some of these values if you don't want to use mock data.

| Name                                   | Example value                                | Description                                                                              |
| -------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| REACT_APP_API_URL                      | `https://api.dev.nva.aws.unit.no`            | Required. Base URL to the API.                                                           |
| REACT_APP_USE_MOCK                     | `false`                                      | Whether to use local mock data or not. If `true`, no more variables are needed.          |
| REACT_APP_REDIRECT_SIGN_IN             | `http://localhost:3000`                      | Callback URI for successfull login.                                                      |
| REACT_APP_REDIRECT_SIGN_OUT            | `http://localhost:3000/logout`               | Callback URI for successfull logout.                                                     |
| REACT_APP_AWS_REGION                   | `eu-west-1`                                  | Value can be found by logging in to the Parameter Store in AWS.                          |
| REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID | `eu-west-1:XXXXXXXXXX`                       | Value can be found by logging in to the Parameter Store in AWS.                          |
| REACT_APP_AWS_USER_POOLS_ID            | `eu-west-1:XXXXXXXXXX`                       | Value can be found by logging in to the Parameter Store in AWS.                          |
| REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID | `XXXXXXXXXX`                                 | Value can be found by logging in to the Parameter Store in AWS.                          |
| REACT_APP_DOMAIN                       | `XXXXXXXXX.auth.eu-west-1.amazoncognito.com` | Value can be found by logging in to the Parameter Store in AWS.                          |
| REACT_APP_ORCID_BASE_URL               | `https://sandbox.orcid.org`                  | Base URL to ORCID integration.                                                           |
| REACT_APP_ORCID_REDIRECT_URI           | `http://localhost:3000/my-profile`           | Callback URI for successfull connection to ORCID.                                        |
| REACT_APP_ORCID_CLIENT_ID              | `APP-XXXXXXXXX`                              | Value can be found by logging in to the Parameter Store in AWS or ORCID Admin dashboard. |

## Available Scripts

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### Testing

#### `npm run test:cypress`

Runs cypress tests.

Note: On Windows the `test:cypress` script must be edited in order to work:

```diff
- "test:cypress": "REACT_APP_USE_MOCK=true start-server-and-test http://localhost:3000",
+ "test:cypress": "set REACT_APP_USE_MOCK=true && start-server-and-test http://localhost:3000",
```

Alternatively, one can run the Cypress tests in watch mode by starting tha app with mock data, and run `npx cypress open`.

#### `npm run test:react`

Runs React testing library tests

## Generate code coverage

`npx nyc report`

coverage report: `coverage/lcov-report/index.html`

## Generate test files using faker.js

Generate your desired structure of the object/list. (Example: generateProjectList.ts)

Navigate to the folder your test file is in.

Run `npx tsc && npx ts-node generateProjectList` to generate.
