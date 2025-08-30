/* global process */
// @ts-check

/** @typedef {import('@actions/github-script').AsyncFunctionArguments} AsyncFunctionArguments */

/**
 *
 * @param {string} state
 * @returns {state is 'success' | 'failure' | 'pending' | 'error'}
 */
function isValidState(state) {
  return ["success", "failure", "pending", "error"].includes(state);
}

/**
 * @param {AsyncFunctionArguments} args
 */
export default async ({ github, core, context }) => {
  try {
    /** @type {string} */
    const state = (process.env.IN_STATE || "").toLowerCase();
    if (!isValidState(state)) {
      core.setFailed(
        `Invalid state "${state}". Must be one of "success", "failure", "pending", "error".`,
      );
      return;
    }

    /** @type {string} */
    const ctxName = process.env.IN_CONTEXT || "";
    if (!ctxName) {
      core.setFailed('Input "context" is required.');
      return;
    }

    const description = process.env.IN_DESC || undefined;
    const target_url = process.env.IN_TARGET_URL || undefined;

    const owner = process.env.IN_OWNER || context.repo.owner;
    const repo = process.env.IN_REPO || context.repo.repo;

    const inputSha = process.env.IN_SHA || "";
    const prSha = context.payload?.pull_request?.head?.sha;
    const sha = inputSha || prSha || process.env.GITHUB_SHA;

    if (!sha) {
      core.setFailed(
        "Unable to resolve commit SHA. Provide inputs.sha or run on a PR/push event.",
      );
      return;
    }

    core.info(
      `Posting commit status: ${state} [${ctxName}] on ${owner}/${repo}@${sha.slice(0, 7)}`,
    );

    await github.rest.repos.createCommitStatus({
      owner,
      repo,
      sha,
      state,
      context: ctxName,
      description,
      target_url,
    });

    core.info("Commit status created successfully.");

    return {
      state,
      context: ctxName,
      owner,
      repo,
      sha,
      description: description ?? null,
      target_url: target_url ?? null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    core.setFailed(`Failed to create commit status: ${message}`);
  }
};
