import * as tl from 'azure-pipelines-task-lib/task';
import * as tr from 'azure-pipelines-task-lib/toolrunner';
import { skip } from 'node:test';

async function run(): Promise<void> {
  try {
    const namespace: string | undefined = tl.getInput('namespace', true);
    const imageName: string | undefined = tl.getInput('imageName', true);
    const artifact: string = tl.getInput('artifact', true) || '';
    const region: string = tl.getInput('region', true) || '';
    const imageTag: string = tl.getInput('imageTag', true) || '';
    const buildContext: string = tl.getInput('buildContext', true) || '';
    const skipBuild: boolean = tl.getBoolInput('skipBuild', false);

    const massTool: tr.ToolRunner = tl.tool('mass');
    massTool.arg('image');
    massTool.arg('push');
    massTool.arg(`${namespace}/${imageName}`);
    massTool.arg('--artifact');
    massTool.arg(artifact);
    massTool.arg('--region');
    massTool.arg(region);
    massTool.arg('--build-context');
    massTool.arg(buildContext);
    massTool.arg('--image-tag');
    massTool.arg(imageTag);
    if (skipBuild) {
      massTool.arg('--skip-build')
    }

    const exitCode: number = await massTool.execAsync();

    if (exitCode === 0) {
      console.log('Mass image pushed successfully.');
    } else {
      tl.setResult(tl.TaskResult.Failed, 'Error pushing Mass image');
    }
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, `Error: ${error}`);
  }
}

run();
