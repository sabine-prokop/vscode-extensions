import { SimpleGit } from 'simple-git';
import { window } from 'vscode';
import { getCleanedBranchName } from '../helpers/branch-name.helpers';
import { catchTask, createLocalBranch, isBranchSummary } from '../helpers/simple-git.helpers';
import { getBranchNameInputValue, showVscodeErrorMessage } from '../helpers/vscode.helpers';

type BranchOption = { label: string; value: string };

export async function executeCreateFromRemoteCommand(simpleGit: SimpleGit) {
  const remoteBranchName = await getRemoteBranchName(simpleGit);
  if (remoteBranchName !== null) {
    const branchName = await getBranchNameInputValue(getCleanedBranchName(remoteBranchName));
    if (branchName !== null) {
      createLocalBranch(remoteBranchName, branchName, simpleGit);
    }
  }
}

async function getRemoteBranchName(simpleGit: SimpleGit): Promise<string | null> {
  const remoteBranches = await getRemoteBrancheSelectionValue(simpleGit);
  if (remoteBranches === null) {
    return null;
  }
  const result = await window.showQuickPick(remoteBranches, {
    placeHolder: 'When no remote branch was picked "origin/develop" will be used',
    matchOnDetail: true
  });
  return result?.value || 'origin/develop';
}

async function getRemoteBrancheSelectionValue(simpleGit: SimpleGit): Promise<BranchOption[] | null> {
  window.showInformationMessage('Loading remote branches');
  const branchSummary = await simpleGit.branch({ '-a': null }).catch(catchTask);
  if (isBranchSummary(branchSummary)) {
    const currentBranch: BranchOption[] = [];
    const localMain: BranchOption[] = [];
    const localDevelop: BranchOption[] = [];
    const remoteMain: BranchOption[] = [];
    const remoteDevelop: BranchOption[] = [];
    const localBranches: BranchOption[] = [];
    const remoteBranches: BranchOption[] = [];

    Object.values(branchSummary.branches).forEach((branch) => {
      const label = branch.name.startsWith('remotes/') ? branch.name.substring(8) : branch.name;
      const option: BranchOption = { label, value: branch.name };
      if (branch.current) {
        currentBranch.push(option);
      } else if (option.value === 'master' || option.value === 'main') {
        localMain.push(option);
      } else if (option.value === 'develop') {
        localDevelop.push(option);
      } else if (option.value === 'remotes/origin/master' || option.value === 'remotes/origin/main') {
        remoteMain.push(option);
      } else if (option.value === 'remotes/origin/develop') {
        remoteDevelop.push(option);
      } else if (option.value.startsWith('remotes/')) {
        remoteBranches.push(option);
      } else {
        localBranches.push(option);
      }
    });
    return [...currentBranch, ...localMain, ...localDevelop, ...localBranches, ...remoteMain, ...remoteDevelop, ...remoteBranches];
  } else {
    showVscodeErrorMessage('Remote branches could not be loaded', branchSummary);
    return null;
  }
  return [];
}
