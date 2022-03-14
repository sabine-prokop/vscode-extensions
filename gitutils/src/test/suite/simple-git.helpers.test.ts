import * as assert from 'assert';
import * as sinon from 'sinon';
import { SimpleGit } from 'simple-git';
import { createLocalBranch } from '../../helpers/simple-git.helpers';

suite('Simple git helpers', () => {
  suite('createLocalBranch()', () => {
    const simpleGit = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      checkout: () => {}
    } as SimpleGit;

    test('checks out branch with correct parameters', function () {
      const baseBranch = 'origin/base';
      const newBranch = 'feature/drgn-123-new';
      const checkoutSpy = sinon.spy(simpleGit, 'checkout');

      createLocalBranch(baseBranch, newBranch, simpleGit);

      assert(checkoutSpy.calledOnce);
      assert(checkoutSpy.calledWith({ '-b': null, 'feature/drgn-123-new': null, '--no-track': null, 'origin/base': null }));
    });
  });
});
