import { FetchResult, GitError, StatusResult, InitResult, SimpleGit, BranchSummary } from 'simple-git';
import { showVscodeErrorMessage } from './vscode.helpers';

export async function createLocalBranch(baseBranch: string, newBranch: string, simpleGit: SimpleGit) {
  const checkoutResult = await simpleGit
    .checkout({ '-b': null, [newBranch]: null, '--no-track': null, [baseBranch]: null })
    .catch(catchTask);
  if (isGitError(checkoutResult)) {
    showVscodeErrorMessage(`Branch ${newBranch} with base ${baseBranch} couldn't be created:`, checkoutResult);
  }
}

export function isFetchResult(fetchResult: FetchResult | GitError | undefined): fetchResult is FetchResult {
  return !!fetchResult && (<FetchResult>fetchResult).raw !== undefined;
}

export function isStatusResult(statusResult: StatusResult | GitError | undefined): statusResult is StatusResult {
  return !!statusResult && (<StatusResult>statusResult).isClean !== undefined;
}

export function isInitResult(initResult: InitResult | GitError | undefined): initResult is InitResult {
  return !!initResult && (<InitResult>initResult).existing !== undefined;
}

export function isBranchSummary(branchSummary: BranchSummary | GitError | undefined): branchSummary is BranchSummary {
  return !!branchSummary && (<BranchSummary>branchSummary).branches !== undefined;
}

export function isGitError(result: unknown | GitError | undefined): result is GitError {
  return !!result && (<GitError>result).message !== undefined;
}

export function catchTask(error: GitError) {
  return error;
}
