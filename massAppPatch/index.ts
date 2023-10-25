import * as tl from 'azure-pipelines-task-lib/task';
import * as tr from 'azure-pipelines-task-lib/toolrunner';

async function run(): Promise<void> {
  try {
    const project: string = tl.getInput('project', true) || '';
    const env: string = tl.getInput('env', true) || '';
    const manifest: string = tl.getInput('manifest', true) || '';
    const input: string = tl.getInput('input', true) || '';

    const massTool: tr.ToolRunner = tl.tool('mass');
    massTool.arg('app');
    massTool.arg('patch');
    massTool.arg(`${project}-${env}-${manifest}`);
    for (var element of input) {
      massTool.arg(`--set=${element}`);
    }

      const exitCode: number = await massTool.execAsync();

      if (exitCode === 0) {
        console.log('Operation succeeded.');
      } else {
        tl.setResult(tl.TaskResult.Failed, 'Error executing the command.');
      }
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, `Error: ${error}`);
  }
}

run();
