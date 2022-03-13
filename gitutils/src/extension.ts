import simpleGit, { SimpleGitOptions } from 'simple-git';
import * as vscode from 'vscode';
import { executeCreateFromRemoteCommand } from './commands/create-from-remote';
import { executeCreateFromCurrentCommand } from './commands/create-from-current';
import { executeCreateFromDevelopCommand } from './commands/create-from-develop';
import { catchTask, isInitResult } from './helpers/simple-git.helpers';
import { showVscodeErrorMessage } from './helpers/vscode.helpers';

export async function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders?.length) {
    const workspaceFolder = workspaceFolders[0].uri.fsPath;

    const options: Partial<SimpleGitOptions> = {
      baseDir: workspaceFolder,
      binary: 'git'
    };

    const git = simpleGit(options);
    const initialized = await git.init().catch(catchTask);

    if (isInitResult(initialized)) {
      const prefixBranchCommand = vscode.commands.registerCommand(
        'gitutils.createFromRemote',
        async () => await executeCreateFromRemoteCommand(git)
      );

      const prefixBranchForDevelopCommand = vscode.commands.registerCommand(
        'gitutils.createFromDevelop',
        async () => await executeCreateFromDevelopCommand(git)
      );

      const prefixBranchForCurrentCommand = vscode.commands.registerCommand(
        'gitutils.createFromCurrent',
        async () => await executeCreateFromCurrentCommand(git)
      );

      context.subscriptions.push(prefixBranchCommand);
      context.subscriptions.push(prefixBranchForDevelopCommand);
      context.subscriptions.push(prefixBranchForCurrentCommand);
    } else {
      showVscodeErrorMessage('Git could not be initialized', initialized);
    }
  } else {
    vscode.window.showErrorMessage('Working folder not found, open a folder an try again');
  }
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
