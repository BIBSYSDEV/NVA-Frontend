# Deployment

The application is deployed as an [Immutable Web App](https://github.com/ImmutableWebApps/immutablewebapps.github.io). This allows us to build the app only once while deploying it to multiple environments, where `<env>.index.html` works as a deployable configuration. See [deployment.drawio.svg](deployment.drawio.svg) for complete overview for how this is set up.

## Environments

| Name      | URL                          | Description                                                                                                             |
| --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `dev`     | frontend.dev.nva.sikt.no     | Unstable solution with latest changes (`main` branch) with test data. Used by internal users, like the development team |
| `test`    | frontend.test.nva.sikt.no    | Semi-stable solution with test data. Used by invited people, to verify solution                                         |
| `e2e`     | frontend.e2e.nva.sikt.no     | Solution for testing. Used by developers. **NB! Redundant with both `sandbox` and `e2e`?**                              |
| `sandbox` | frontend.sandbox.nva.sikt.no | Solution for testing. Used by developers. **NB! Redundant with both `sandbox` and `e2e`?**                              |
| `prod`    | nva.sikt.no                  | Stable solution with production data. Used by anyone                                                                    |

## GitHub

The app is hosted as open source on GitHub: https://github.com/BIBSYSDEV/NVA-Frontend. A push to the `main` branch will trigger AWS CodePipeline to deploy the new version in the `dev` environment.

## AWS CodePipeline

CodePipeline is the AWS CI/CD service. This is used in four steps:

1. **Source**: Fetch latest code from GitHub (`main` branch)
2. **Build**: Build the app (with AWS CodeBuild)
3. **Deploy**: Move the build outputs to the `builds/latest` catalog in AWS S3, and the `<env>.index.html` files to the `index-files` catalog in AWS S3
4. **Test**: Run e2e tests on the recent build

## AWS CodeBuild

Codebuild is the AWS build service. This is used to install dependencies, build, and run tests for an app. We have three CodeBuild projects:

- `Frontend-build`: Builds the React app and place the outputs in the `latest` build catalog.
- `Promote-version`: Promotes the current `latest` build to a new build catalog with the current date as the name.
- `Set-version`: Copies a version to the S3-bucket for the selected environment.
- `Build-validation`: Ensures that the pushed branch is buildable, and that some frontend tests with mock data is OK.
- `e2e-test`: Runs e2e test towards a specified build version.

## AWS S3

S3 is the AWS Simple Storage Service which allows storing objects and resources. Builds are stored in the `frontend-builds`-bucket. Each environment have a bucket configured as a static website containing the correct version for the environment

## AWS CloudFront

CloudFront is the AWS Content Delivery Network (CDN). Each environment have a CloudFront distribution exposing the S3 bucket configured as a website.

## AWS Route 53

Route 53 is the AWS DNS service. This is used to expose the app on intuitive URLs like `nva.sikt.no` instead of `<random-id>.cloudfront.net`.

# Questions:

- Problematic that extrnal users have access to `dev` and other environments than `prod`?
- When are tests run?
- Can we make a temp deploy for every PR so that PO can verify the solution before merge?
