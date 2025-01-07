# Create Git Tag Action

[![GitHub Marketplace](https://img.shields.io/badge/marketplace-create--git--tag-blue.svg?logo=github)](https://github.com/marketplace/actions/create-git-tag)  
A lightweight GitHub Action to create Git tags in your repository.

## 🚀 Features

- Create lightweight Git tags for commits or branches.
- Ensure tags are unique by checking for existing tags.
- Specify a commit SHA or branch to tag (defaults to the current workflow SHA).
- Easy integration into your GitHub workflows.

---

## 📥 Inputs

| Input Name     | Description                                      | Required | Default                |
|----------------|--------------------------------------------------|----------|------------------------|
| `tag_name`     | The tag name to create (e.g., `v1.2.3`).         | `true`   | N/A                    |
| `commitish`    | The commit SHA or branch to tag.                 | `false`  | The current workflow's SHA |
| `GITHUB_TOKEN` | GitHub token for authentication.                 | `true`   | N/A                    |

---

## 📤 Outputs

| Output Name    | Description                              |
|----------------|------------------------------------------|
| `created_tag`  | The name of the tag that was created.    |

---

## 🛠 Usage

Here’s how to use the action in your GitHub workflows:

### Example Workflow

```yaml
name: Create Git Tag

on:
  push:
    branches:
      - main

jobs:
  create-tag:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Create Git Tag
        uses: dnogu/create-tag-action@v1
        with:
          tag_name: "v1.2.3"
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Key Points
- Replace `v1.2.3` with the desired tag name (e.g., `v1.0.0` or any semantic versioning tag you prefer).
- The `GITHUB_TOKEN` is automatically provided by GitHub Actions and allows the action to authenticate with the GitHub API.
- Ensure the `tag_name` is unique to prevent conflicts with existing tags.

---

## 🧪 Testing Locally

You can test this action directly in your repository by creating a temporary workflow file in the `.github/workflows/` directory.

### Example Test Workflow

```yaml
name: Test Create Tag Action

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Test Create Git Tag
        uses: ./
        with:
          tag_name: "v1.2.3"
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Steps to Test:
1. **Set Up the Workflow**:
   - Add the example workflow to your repository under `.github/workflows/test-action.yml`.

2. **Push Changes**:
   - Push the workflow file to your repository on the `main` branch.

3. **Verify the Workflow**:
   - Check the **Actions** tab in your repository to ensure the workflow runs successfully.

4. **Check the Tag**:
   - Navigate to your repository’s **Tags** section (found under the "Code" tab).
   - Confirm that the specified tag (e.g., `v1.2.3`) has been created.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). By using this action, you acknowledge that it is provided "as is" without warranty of any kind.

---

## 📧 Support

For issues or feature requests, open an [issue](https://github.com/your-username/create-tag-action/issues) on the repository. Contributions are welcome—feel free to fork the project and submit a pull request!

---

## 🙌 Acknowledgments

Built with 💻 by [Your Name](https://github.com/your-username). Inspired by the need for simple, automated Git tag creation in workflows.
