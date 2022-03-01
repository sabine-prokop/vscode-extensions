import { SimpleGit } from 'simple-git';
import { catchTask, createLocalBranch, isFetchResult } from '../helpers/simple-git.helpers';
import { getBranchNameInputValue, showVscodeErrorMessage } from '../helpers/vscode.helpers';

export async function executeCreateFromDevelopCommand(simpleGit: SimpleGit) {
  const newBranchName = await getBranchNameInputValue();
  if (newBranchName !== null) {
    const fetchResult = await simpleGit.fetch({ origin: null, develop: null }).catch(catchTask);
    if (isFetchResult(fetchResult)) {
      createLocalBranch('origin/develop', newBranchName, simpleGit);
    } else {
      showVscodeErrorMessage('No remote found for origin/develop', fetchResult);
    }
  }
}
