const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    // Get inputs
    const tagName = core.getInput("tag_name", { required: true }); // Tag name (e.g., v1.2.3)
    const commitish = core.getInput("commitish") || github.context.sha; // Commit SHA or branch to tag
    const token = core.getInput("GITHUB_TOKEN", { required: true }); // GitHub authentication token

    // Create an authenticated GitHub client
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    core.info(`Creating tag "${tagName}" for commit "${commitish}" in repository ${owner}/${repo}`);

    // Check if the tag already exists
    const { data: existingTags } = await octokit.rest.repos.listTags({
      owner,
      repo,
      per_page: 100, // Fetch up to 100 tags for validation
    });

    if (existingTags.some((tag) => tag.name === tagName)) {
      throw new Error(`Tag "${tagName}" already exists in the repository.`);
    }

    // Create the new tag
    const createdTag = await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: commitish,
    });

    core.info(`Tag "${tagName}" created successfully at commit "${commitish}".`);
    core.setOutput("created_tag", createdTag.ref);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
