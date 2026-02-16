# Maintenance Message

There are two ways to display global information to users of the application:

- Show a simple yellow information banner at the top of the page
- Close down all routes and display only an information message

### Information Banner

To show a banner only:

1. Go to AWS Amplify
2. Select the NVA-Frontend app
3. Navigate to Hosting -> Environment variables -> Manage variables
4. Set the following variables:
   - `VITE_MAINTENANCE_MESSAGE_NB` - Norwegian message
   - `VITE_MAINTENANCE_MESSAGE_EN` - English message
5. Save the environment variable changes
6. Navigate to Overview -> `main` branch -> ´Redeploy this version´

### Closing down the application

To block access and show only an information page:

1. Go to AWS Amplify
2. Select the NVA-Frontend app
3. Navigate to Hosting -> Environment variables -> Manage variables
4. Set the following variables:
   - `VITE_MAINTENANCE_MESSAGE_NB` - Norwegian message
   - `VITE_MAINTENANCE_MESSAGE_EN` - English message
   - `VITE_MAINTENANCE_SEVERITY` - set to `block`
5. Save the environment variable changes
6. Navigate to Overview -> `main` branch -> ´Redeploy this version´

### Scheduling messages

You can schedule both the banner and the full block by adding the following environment variables:

1. `VITE_MAINTENANCE_START` - e.g. `2025-01-01T12:00:00.000Z`
2. `VITE_MAINTENANCE_END` - e. g. `2025-01-02T12:00:00.000Z`

### Limitation

It is not possible to schedule a change from severity=none to severity=block independent of the message text.

In practice, this means you cannot automatically:

- Show a banner such as: `“At noon on February X, the application will be taken down for maintenance.”`
- And then, at that time, switch to a full block with a message such as: `“The application is under maintenance.”`

To achieve this, you must manually update the environment variables and redeploy at the time of the
change. This limits the usefulness of scheduling for this scenario.
