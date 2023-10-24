import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import child_process from 'child_process';

async function fetchAndInstallLatestRelease(currentVersion: string) {
  try {
    const githubRepo = 'massdriver-cloud/mass';
    const apiUrl = `https://api.github.com/repos/${githubRepo}/releases/latest`;

    // Fetch the latest release from GitHub
    const response = await axios.get(apiUrl);
    const latestRelease = response.data;

    // Extract the asset URL for the Mass CLI binary
    const assetUrl = latestRelease.assets.find((asset: any) =>
      asset.name.match(/mass-\d+\.\d+\.\d+-linux-amd64\.tar\.gz/)
    ).browser_download_url;

    // Install the latest release if it's newer than the current version
    await installLatestRelease(assetUrl, currentVersion);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function installLatestRelease(assetUrl: string, currentVersion: string) {
  try {
    // Extract the version from the asset file name
    const versionRegex = /mass-(\d+\.\d+\.\d+)-linux-amd64\.tar\.gz/;
    const match = assetUrl.match(versionRegex);
    if (!match || !match[1]) {
      throw new Error('Could not extract version from asset URL.');
    }
    const latestVersion = match[1];

    // Compare the latest version with the current version
    if (latestVersion !== currentVersion) {
      // Download the release asset
      const downloadPath = path.join(__dirname, `mass-${latestVersion}-linux-amd64.tar.gz`);
      const assetResponse = await axios.get(assetUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(downloadPath);
      assetResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Make the downloaded binary executable (if needed)
      fs.chmodSync(downloadPath, '755');

      // Install the CLI using the downloaded binary
      const installCommand = `tar -xzf ${downloadPath} -C /usr/local/bin/`;
      child_process.execSync(installCommand);

      console.log(`Mass CLI ${latestVersion} installed.`);
    } else {
      console.log('No new release found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const currentVersion = '1.5.5'; // Replace with your current version
fetchAndInstallLatestRelease(currentVersion);
