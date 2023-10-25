import * as tl from 'azure-pipelines-task-lib/task';
import * as tr from 'azure-pipelines-task-lib/toolrunner';

async function run(): Promise<void> {
  try {
    const project: string | undefined = tl.getInput('project', true);
    const env: string | undefined = tl.getInput('env', true);
    const manifest: string | undefined = tl.getInput('manifest', true);

    const massTool: tr.ToolRunner = tl.tool('mass');
    massTool.arg('app');
    massTool.arg('deploy');
    massTool.arg(`${project}-${env}-${manifest}`);

    const exitCode: number = await massTool.execAsync();

    if (exitCode === 0) {
      console.log('Massdriver application deployed successfully.');
    } else {
      tl.setResult(tl.TaskResult.Failed, 'Error deploying Massdriver application');
    }
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, `Error: ${error}`);
  }
}

run();
