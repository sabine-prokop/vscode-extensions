import { GitError } from 'simple-git';
import { window } from 'vscode';
import { mapInputToBranchName, validateBranchName } from './branch-name.helpers';

export function showVscodeErrorMessage(message: string, error?: GitError) {
  const gitError = error ? `: ${error.message}` : '';
  window.showErrorMessage(`${message}${gitError}`);
}

export async function getBranchNameInputValue(value?: string): Promise<string | null> {
  const input = await window.showInputBox({
    value,
    placeHolder: 'Enter Jira id and title. For example: DRGN-1108 Remove draw.io language picker',
    validateInput: (text) => validateBranchName(text)
  });
  return input ? mapInputToBranchName(input) : null;
}
