import { SimpleGit } from 'simple-git';
import { catchTask, isStatusResult, createLocalBranch } from '../helpers/simple-git.helpers';
import { getBranchNameInputValue, showVscodeErrorMessage } from '../helpers/vscode.helpers';
import { window } from 'vscode';

export async function executeCreateFromCurrentCommand(simpleGit: SimpleGit) {
  const status = await simpleGit.status().catch(catchTask);
  if (isStatusResult(status)) {
    const baseBranch = status.current;
    if (baseBranch) {
      const branchName = await getBranchNameInputValue(baseBranch);
      if (branchName !== null) {
        await createLocalBranch(baseBranch, branchName, simpleGit);
      }
    } else {
      window.showErrorMessage('No remote found for active branch, checkout a branch and try again');
    }
  } else {
    showVscodeErrorMessage('Git status command failed', status);
  }
}
