import * as tl from 'azure-pipelines-task-lib/task';
import * as tr from 'azure-pipelines-task-lib/toolrunner';

async function run(): Promise<void> {
  try {
    const project: string = tl.getInput('project', true) || '';
    const env: string = tl.getInput('env', true) || '';
    const manifest: string = tl.getInput('manifest', true) || '';
    const setImagePath: string = tl.getInput('setImagePath', true) || '';
    const setImageValue: string = tl.getInput('setImageValue', true) || '';

    if (setImagePath) {
      const massTool: tr.ToolRunner = tl.tool('mass');
      massTool.arg('app');
      massTool.arg('patch');
      massTool.arg(`${project}-${env}-${manifest}`);
      massTool.arg('--set=');
      massTool.arg(`${setImagePath}=${setImageValue}`);

      const exitCode: number = await massTool.exec();

      if (exitCode === 0) {
        console.log('Image tag set in the manifest.');
      } else {
        tl.setResult(tl.TaskResult.Failed, 'Error setting image tag in the manifest.');
      }
    } else {
      console.log('setImagePath is not defined or empty. No replacement performed.');
    }
  } catch (error) {
    tl.setResult(tl.TaskResult.Failed, `Error: ${error}`);
  }
}

run();
