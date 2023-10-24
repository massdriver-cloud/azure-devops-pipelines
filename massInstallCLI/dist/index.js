"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
async function fetchAndInstallLatestRelease(currentVersion) {
    try {
        const githubRepo = 'massdriver-cloud/mass';
        const apiUrl = `https://api.github.com/repos/${githubRepo}/releases/latest`;
        // Fetch the latest release from GitHub
        const response = await axios_1.default.get(apiUrl);
        const latestRelease = response.data;
        // Extract the asset URL for the Mass CLI binary
        const assetUrl = latestRelease.assets.find((asset) => asset.name.match(/mass-\d+\.\d+\.\d+-linux-amd64\.tar\.gz/)).browser_download_url;
        // Install the latest release if it's newer than the current version
        await installLatestRelease(assetUrl, currentVersion);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
async function installLatestRelease(assetUrl, currentVersion) {
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
            const downloadPath = path_1.default.join(__dirname, `mass-${latestVersion}-linux-amd64.tar.gz`);
            const assetResponse = await axios_1.default.get(assetUrl, { responseType: 'stream' });
            const writer = fs_extra_1.default.createWriteStream(downloadPath);
            assetResponse.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            // Make the downloaded binary executable (if needed)
            fs_extra_1.default.chmodSync(downloadPath, '755');
            // Install the CLI using the downloaded binary
            const installCommand = `tar -xzf ${downloadPath} -C /usr/local/bin/`;
            child_process_1.default.execSync(installCommand);
            console.log(`Mass CLI ${latestVersion} installed.`);
        }
        else {
            console.log('No new release found.');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
const currentVersion = '1.5.5'; // Replace with your current version
fetchAndInstallLatestRelease(currentVersion);
