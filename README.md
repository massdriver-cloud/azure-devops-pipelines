# Azure DevOps Pipeline for the Mass CLI

## Introduction

## Publishing a new release

1. Run `tsc` in any task directory that was updated
2. Bump the major version of the task in the `task.json` file
3. Bump the version of the extension in the `vss-extension.json` file
4. Run `tfx extension create --manifest-globs vss-extension.json` in the root directory
5. Open Massdriver [publisher](https://marketplace.visualstudio.com/manage/publishers/Massdriver)
6. Click 3 dots next to the extension and select `Update`
7. Upload the new version of the extension (.vsix file)