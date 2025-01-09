const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    // Get inputs
    const tagName = core.getInput("tag_name", { required: true });
    const commitish = core.getInput("commitish") || github.context.sha;
    const token = core.getInput("GITHUB_TOKEN", { required: true });

    // Validate inputs
    if (!isValidTagName(tagName)) {
      throw new Error(`Invalid tag name: "${tagName}". Ensure it follows the correct format.`);
    }

    // Create authenticated GitHub client
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    core.info(`Creating tag "${tagName}" for commit "${commitish}" in repository ${owner}/${repo}`);

    // Check if tag already exists
    if (await doesTagExist(octokit, owner, repo, tagName)) {
      throw new Error(`Tag "${tagName}" already exists in the repository.`);
    }

    // Create tag
    const createdTag = await createTag(octokit, owner, repo, tagName, commitish);

    core.info(`Tag "${tagName}" created successfully at commit "${commitish}".`);
    core.setOutput("created_tag", createdTag.ref);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Function to validate the tag name format
function isValidTagName(tagName) {
  const tagRegex = /^(v|Test-)?\d+\.\d+\.\d+(-[a-zA-Z0-9_.]+)?$/;
  return tagRegex.test(tagName);
}

// Function to check if a tag already exists
async function doesTagExist(octokit, owner, repo, tagName) {
  try {
    let page = 1;
    while (true) {
      const { data: tags } = await octokit.rest.repos.listTags({
        owner,
        repo,
        per_page: 100,
        page,
      });
      if (tags.some((tag) => tag.name === tagName)) {
        return true;
      }
      if (tags.length < 100) break; // No more pages
      page++;
    }
    return false;
  } catch (error) {
    throw new Error(`Error checking for existing tags: ${error.message}`);
  }
}

// Function to create a new tag
async function createTag(octokit, owner, repo, tagName, commitish) {
  try {
    return await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: commitish,
    });
  } catch (error) {
    throw new Error(`Failed to create tag "${tagName}": ${error.message}`);
  }
}

run();
