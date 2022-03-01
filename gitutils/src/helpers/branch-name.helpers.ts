export function mapInputToBranchName(input: string): string {
  const trimmedResult = input!.trim().toLowerCase();
  const cleanedResult = trimmedResult?.startsWith('feature/') ? trimmedResult.substring(8) : trimmedResult;
  const parsedResult = cleanedResult.replace(/[^a-z0-9\-]/g, '-');
  const resultWithoutRepeatingHyphens = parsedResult.replace(/-+/g, '-');
  const resultWithoutTrailingHyphens = resultWithoutRepeatingHyphens.replace(/-+$/g, '');
  return `feature/${resultWithoutTrailingHyphens}`;
}

export function validateBranchName(input: string): null | string {
  const name = input.trim();
  if (!input.length) {
    return 'Enter a branch name';
  }
  const startsWithTicketNumber = new RegExp(/^[A-Za-z]+-\d+/g);
  if (!startsWithTicketNumber.test(input)) {
    return 'Add a JIRA Ticket id at the beginning';
  }
  return null;
}

export function getCleanedBranchName(input: string): string {
  const withoutRemotesPrefix = input.startsWith('remotes/') ? input.substring(8) : input;
  return withoutRemotesPrefix.startsWith('origin/') ? withoutRemotesPrefix.substring(7) : withoutRemotesPrefix;
}
