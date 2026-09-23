TRIVEX EDIT — V8.6 DIRECT PUBLISH VIDEO MANAGER

This version adds a direct publish workflow for GitHub Pages.

ADD A VIDEO
1. Open the live site.
2. Tap the ⚙ Portfolio Manager button.
3. Enter title, category and your public YouTube/Vimeo/direct video URL.
4. Tap ADD PROJECT to save locally, or ADD + PUBLISH LIVE to add and publish in one flow.
5. YouTube thumbnails are automatic when possible.

DIRECT PUBLISH
1. Tap PUBLISH CHANGES or ADD + PUBLISH LIVE.
2. Enter GitHub owner, repository and branch (defaults are already filled for the TRIVEX EDIT repository).
3. Paste a GitHub Personal Access Token that has Contents → Read and write permission for the repository.
4. Tap PUBLISH NOW.
5. The site automatically updates projects.json through GitHub's API. No manual file replacement is needed.

SECURITY
- The website does not save the GitHub token in localStorage or in projects.json.
- The token is used only in the current browser session/request and is cleared when the publish form is closed/refreshed.
- Create a token limited to this repository with only Contents: Read and write permission.

IMPORTANT
GitHub Pages is a static hosting service. This feature publishes project metadata (projects.json), not large video files. Your actual videos should be hosted on YouTube, Vimeo, or another public video host and added by URL.
