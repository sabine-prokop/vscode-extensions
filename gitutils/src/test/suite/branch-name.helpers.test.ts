import * as assert from 'assert';
import { mapInputToBranchName, validateBranchName } from '../../helpers/branch-name.helpers';

suite('Branch name helpers', () => {
  suite('mapInputToBranchName()', () => {
    test('does not adjust valid branch names', function () {
      const input = 'feature/drgn-123-aaa-bbb';
      const branchName = mapInputToBranchName(input);
      assert.strictEqual(branchName, 'feature/drgn-123-aaa-bbb');
    });

    test('adjusts invalid branch names', function () {
      const input = 'DRGN-123 A JIRA-Ticket headline';
      const branchName = mapInputToBranchName(input);
      assert.strictEqual(branchName, 'feature/drgn-123-a-jira-ticket-headline');
    });

    test('removes trailing and dupplicated hyphens in branch names', function () {
      const input = 'DRGN-123    A    JIRA-Ticket headline!!!';
      const branchName = mapInputToBranchName(input);
      assert.strictEqual(branchName, 'feature/drgn-123-a-jira-ticket-headline');
    });
  });

  suite('validateBranchName()', () => {
    test('returns error string for empty input', function () {
      const input = '';
      const branchName = validateBranchName(input);
      assert.strictEqual(branchName, 'Enter a branch name');
    });

    test('returns error string when JIRA ticket id is missing', function () {
      const input = 'A ticket title';
      const branchName = validateBranchName(input);
      assert.strictEqual(branchName, 'Add a JIRA Ticket id at the beginning');
    });

    test('returns error string when JIRA ticket id is invalid', function () {
      const input = 'drgn 123 A ticket title';
      const branchName = validateBranchName(input);
      assert.strictEqual(branchName, 'Add a JIRA Ticket id at the beginning');
    });

    test('returns null when input is valid', function () {
      const input = 'drgn-123 A test name';
      const branchName = validateBranchName(input);
      assert.strictEqual(branchName, null);
    });
  });
});
