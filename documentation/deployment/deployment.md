# Deployment

The app is deployed via [AWS Amplify](https://aws.amazon.com/amplify/) in the `FRONTEND PROD` [account for Sikt](https://aws.sikt.no/). DNS management is set up in [AWS Route 53](https://aws.amazon.com/route53/) in the same account.

## Environments

AWS Amplify is designed to work with feature branch and GitFlow workflows. Read more in the official docs: [Feature branch deployments and team workflows](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html).
We currently have 4 enviroments (dev, test, sandbox, prod) as described by the following table.

| Enviroment | URL                         | Branch    | Description                                                                                                                                                |
| ---------- | --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev        | https://dev.nva.sikt.no     | `develop` | Under active development. Mainley used by internal users, e.g. the development team. Is password protected against the outside world (including crawlers). |
| test       | https://test.nva.sikt.no    | `staging` | Mainly used by external testers to verify work/progress before it reaches production.                                                                      |
| sandbox    | https://sandbox.nva.sikt.no | `sandbox` | Sandbox environment.                                                                                                                                       |
| prod       | https://nva.sikt.no         | `main`    | Production environment.                                                                                                                                    |

## Work process

All 4 branches mentioned are protected, and should never be deleted. If that happens anyway for some reason, Amplify should still keep the last deployment running as normal, but one can not deploy a new version before the deleted branch is recreated. In the case where a faulty version is deployed, one can redeploy a previous version with the click of a button in AWS Amplify.

The following figure is a simple representation of our process in practice.

```mermaid
---
title: Branching strategy (GitFlow)
---
gitGraph
    commit
    branch staging
    branch develop
    commit
    branch NP-1-feature1
    checkout NP-1-feature1
    commit
    checkout develop
    branch NP-2-bugfix
    checkout NP-2-bugfix
    commit
    checkout develop
    merge NP-2-bugfix tag:"deploy: dev"
    checkout staging
    merge develop tag:"deploy: test"
    checkout NP-1-feature1
    commit
    commit
    checkout develop
    merge NP-1-feature1 tag:"deploy: dev"
    checkout staging
    checkout main
    merge staging tag:"deploy: prod"
```

### Update dev

When working on new features, bug fixes, etc, one should branch out from the `develop` branch. When the job is done, one should create a new PR back into the `develop` branch. Hence, `develop` should include all the newest features, and should always have the newest code. Once a PR is merged into `develop`, Amplify will detect the update and automatically update the app deployed for the dev environment.

### Update test

When one want to update the test environment one will usually create a PR from the `develop` branch into the `staging` branch. Once this PR is merged, Amplify will automatically update the test environment.

### Update sandbox

When one want to update the sandbox environment one will usually create a PR from the `develop` branch into the `sandbox` branch. Once this PR is merged, Amplify will automatically update the sandbox environment.

### Update prod

To update the prod enviroment one will usually create a PR from the `staging` branch (that should have been verified by necessary stakeholders on the test environment) into the `main` branch. Once this PR is merged, Amplify will automatically update the prod environment.

### Deploy a feature branch

In some cases one might want to deploy a feature branch to allow PO or other stakeholders to verify the changes before they are merged to `develop`. This can be achieved by using the "Connect branch" feature in AWS Amplify. After deploying the branch, environment variables `REACT_APP_REDIRECT_SIGN_IN` and `REACT_APP_REDIRECT_SIGN_OUT` must be set, and access control for the branch must be configured (if necessary). Remember to re-deploy after configuring environment variables. Lastly, the branch url has to be added to `Allowed callback URLs` and `Allowed sign-out URLs` in `Hosted UI` in `Cognito` in the NVA environment. 
