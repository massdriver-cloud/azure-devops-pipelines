## About Massdriver

[Massdriver](https://massdriver.cloud) helps engineering and operations teams build secure, production-ready internal developer platforms in minutes.

With over 50+ infrastructure components engineering teams can build golden paths quickly on Kubernetes, serverless, or VMs.

Get the flexibility product engineers need, with the auditing and security operations teams’ demand.

We handle all the boring parts of cloud operations like IAM, secrets, continuous deployment, alerting, and monitoring so your team can focus on the product.

Massdriver supports anti-lockin, by running in your cloud, and open-sourcing all of our infrastructure components.

## About the Mass CLI extension

The Mass CLI extension utilizes the [Mass CLI's](https://docs.massdriver.cloud/cli/overview) command-line capabilities to provide a set of tasks that can be used in Azure DevOps pipelines. These tasks empower you to integrate Massdriver into CI/CD pipelines, and to automate the update of Massdriver-managed infrastructure and applications. The extension has the following tasks:

* [Install Mass CLI](https://github.com/massdriver-cloud/mass/releases)
* [Build and push Docker image](https://docs.massdriver.cloud/cli/commands/mass_image_push)
* [Publish bundle changes](https://docs.massdriver.cloud/cli/commands/mass_bundle_publish)
* [Update bundle configuration](https://docs.massdriver.cloud/cli/commands/mass_application_patch)
* [Deploy bundle changes](https://docs.massdriver.cloud/cli/commands/mass_application_deploy)

## Sample azure-pipelines.yml

```yaml
trigger:
  branches:
    include:
    - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  MASSDRIVER_ORG_ID: $(MD_ORG_ID)
  MASSDRIVER_API_KEY: $(MD_API_KEY)

stages:
- stage: DeployToMassdriver
  jobs:
  - job: push_and_deploy
    steps:
    - checkout: self

    - task: mass-cli-install@0
      displayName: 'Install Massdriver CLI'

    - task: mass-image-push@0
      displayName: 'Push Image'
      inputs:
        namespace: 'foo'
        imageName: 'bar'
        artifact: $(MD_ARTIFACT)
        region: 'eastus'
        imageTag: $(Build.SourceVersion)
        buildContext: './'

    - task: mass-bundle-publish@0
      displayName: 'Publish Bundle'

    - task: mass-app-patch@0
      displayName: 'Set Image Version'
      inputs:
        project: 'dev'
        env: 'test'
        manifest: 'foobar'
        set: '.image.tag="$(Build.SourceVersion)"'

    - task: mass-app-deploy@0
      displayName: 'Deploy App'
      inputs:
        project: 'dev'
        env: 'test'
        manifest: 'foobar'
```
