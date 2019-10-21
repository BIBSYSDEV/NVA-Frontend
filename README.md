This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Environment variables

We are using environment variables in this project.<br>
To be able to run this app, you need to create a .env file with the following fields:<br>
`REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=eu-west-1:XXXXXXXXXXXXXXXXXXXXXXX`<br>
`REACT_APP_AWS_REGION=eu-west-1`<br>
`REACT_APP_AWS_USER_POOLS_ID=eu-west-1_XXXXXXXXXXXX`<br>
`REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXX`<br>
`REACT_APP_DOMAIN=XXXXXXXXX.auth.eu-west-1.amazoncognito.com`<br>

To use mock data, you need to add this variable to the .env file:<br>
`REACT_APP_USE_MOCK=true`

# Generate code coverage

`npm run start:cypress`

`npm run test:cypress --coverage`

coverage report: `coverage/lcov-report/index.html`

# Available Scripts

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Runs cypress

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
