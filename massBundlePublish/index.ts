import * as tl from 'azure-pipelines-task-lib/task';
import * as tr from 'azure-pipelines-task-lib/toolrunner';

async function run(): Promise<void> {
  try {
    const buildDirectory: string | undefined = tl.getInput('buildDirectory', false);
    const access: string | undefined = tl.getInput('access', false);

    const massTool: tr.ToolRunner = tl.tool('mass');
    massTool.arg('bundle');
    massTool.arg('publish');

    if (buildDirectory) {
      massTool.arg('--build-directory');
      massTool.arg(buildDirectory);
    }

    if (access) {
      massTool.arg('--access');
      massTool.arg(access);
    }

    const exitCode: number = await massTool.execAsync();

    if (exitCode === 0) {
      console.log('Mass bundle published successfully.');
    } else {
      tl.setResult(tl.TaskResult.Failed, 'Error publishing Mass bundle');
    }
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, `Error: ${error}`);
  }
}

run();
