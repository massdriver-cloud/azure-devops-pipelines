# Azure DevOps Pipeline for the Mass CLI

## Introduction

## Publishing a new release

1. Run `tsc` in any task directory that was updated
2. Run `tfx extension create --manifest-globs vss-extension.json` in the root directory
3. Open Massdriver [publisher](https://marketplace.visualstudio.com/manage/publishers/Massdriver)
4. Click 3 dots next to the extension and select `Update`
5. Upload the new version of the extension (.vsix file)