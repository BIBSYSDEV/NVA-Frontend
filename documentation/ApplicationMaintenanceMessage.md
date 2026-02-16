# Maintenance Message

There are two ways to globally display information to users of the application:

- Simple yellow information banner at the top
- Closing down any routes and only displaying an information message on the page
  - The header of the application with logo will still be visible

### Information Banner

1. Go to AWS Amplify
2. Select the NVA-Frontend App
3. Hosting -> Environment variables -> Manage variables
4. Set the following variables: 5. `VITE_MAINTENANCE_MESSAGE_NB` for Norwegian text 6. `VITE_MAINTENANCE_MESSAGE_EN` for English text
5. Save the environment variable changes
6. Go to Overview -> `main` branch -> ´Redeploy this version´

### Closing down the application

1. Go to AWS Amplify
2. Select the NVA-Frontend App
3. Hosting -> Environment variables -> Manage variables
4. Set the following variables: 5. `VITE_MAINTENANCE_MESSAGE_NB` for Norwegian text 6. `VITE_MAINTENANCE_MESSAGE_EN` for English text 7. `VITE_MAINTENANCE_SEVERITY` to `block`
5. Save the environment variable changes
6. Go to Overview -> `main` branch -> ´Redeploy this version´

### Scheduling messages

Both of the above-mentioned can be scheduled adding the environment variables:

1. `VITE_MAINTENANCE_START` to i.e. `2025-01-01T12:00:00.000Z`
2. `VITE_MAINTENANCE_END` to i.e. `2025-01-02T12:00:00.000Z`

### Weakness

There is no way of scheduling a `severity=none` to `severity=block` independent of message. This
means that there is no way to automatically go from a banner message "At noon, February
something, the application will be taken down for maintenance" to closing down the application with
message "The application is under maintenance". To achieve this, a manual update of environment
variable and new deploy has to be made. In effect making the scheduling pointless for this case.
