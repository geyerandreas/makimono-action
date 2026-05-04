import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import fs from 'fs';
import { generateContent } from '@qbitone/makimono';

async function run() {
  try {
    const context = github.context;
    const pr = context.payload.pull_request;
    const release_notes_file = core.getInput('release_notes_file');

    // Is this action running in a pull request context?
    if (!pr) {
      core.info("No PR, nothing to do.");
      return;
    }

    const title = pr.title;
    const number = pr.number;
    const url = pr.html_url;
    const login = pr.user.login;
    const userUrl = pr.user.html_url;

    const newLine = `* ${title}. PR [#${number}](${url}) by [@${login}](${userUrl}).`;
    
    core.info(`Add new line: ${newLine}`);

    const changelog = fs.readFileSync(release_notes_file, 'utf8');
    const content = generateContent(changelog, newLine, []);
    fs.writeFileSync(release_notes_file, content, 'utf8');

    await exec('git', ['status', '--porcelain']);
    await exec('git', ['config', 'user.name', 'github-actions[bot]']);
    await exec('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
    await exec('git', ['add', "README.md"]);

    const exitCode = await exec('git', ['diff', '--cached', '--quiet'], { ignoreReturnCode: true });
    if (exitCode === 0) {
      core.info("No changes to commit.");
      return;
    }

    await exec('git', ['commit', '-m', 'docs: update release notes', '-m', '[skip ci]']);
    await exec('git', ['push']);

    core.info("Change committed and pushed successfully.");

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    }
  }
}

run();
