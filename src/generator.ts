import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import { ProjectOptions } from './prompts';
import { logError, logSuccess, logInfo } from './utils';

const execAsync = promisify(exec);

export async function generateProject(options: ProjectOptions): Promise<void> {
  const { 
    appName, 
    projectName, 
    packageName, 
    webviewUrl, 
    addIcons, 
    iconsPath,
    packageManager,
    installDependencies 
  } = options;
  
  const templateDir = path.resolve(__dirname, '../templates/expo');
  const targetDir = path.resolve(process.cwd(), projectName);

  const spinner = ora('Generating project...').start();

  try {
    await fs.access(targetDir);
    spinner.fail();
    logError(`Directory "${projectName}" already exists`);
    process.exit(1);
  } catch {
    // Directory doesn't exist, continue
  }

  spinner.text = 'Copying template files...';
  await copyDirectory(templateDir, targetDir);
  spinner.succeed('Template copied');

  const configSpinner = ora('Configuring app.json...').start();
  await updateAppJson(targetDir, appName, packageName);
  configSpinner.succeed('app.json configured');

  const pkgSpinner = ora('Configuring package.json...').start();
  await updatePackageJson(targetDir, projectName);
  pkgSpinner.succeed('package.json configured');

  const replaceSpinner = ora('Replacing placeholders...').start();
  await replacePlaceholders(targetDir, appName, packageName, webviewUrl);
  replaceSpinner.succeed('Placeholders replaced');

  if (addIcons && iconsPath) {
    const iconsSpinner = ora('Copying icons...').start();
    await copyIcons(iconsPath, targetDir);
    iconsSpinner.succeed('Icons copied');
  }

  if (installDependencies) {
    const installSpinner = ora('Installing dependencies...').start();
    try {
      await execAsync(`${packageManager} install`, { cwd: targetDir });
      installSpinner.text = 'Running expo install...';
      await execAsync(`${packageManager} expo install`, { cwd: targetDir });
      installSpinner.succeed('Dependencies installed');
    } catch (err) {
      installSpinner.fail();
      logError(`Failed to install dependencies: ${err}`);
    }
  }

  logSuccess('Project created correctly');
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function updateAppJson(
  targetDir: string,
  appName: string,
  packageName: string
): Promise<void> {
  const appJsonPath = path.join(targetDir, 'app.json');
  const content = await fs.readFile(appJsonPath, 'utf-8');
  const appJson = JSON.parse(content);

  appJson.expo.name = appName;
  appJson.expo.slug = appName.toLowerCase().replace(/\s+/g, '-');
  appJson.expo.android.package = packageName;
  appJson.expo.ios.bundleIdentifier = packageName;

  await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2));
}

async function updatePackageJson(targetDir: string, projectName: string): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json');
  const content = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);

  pkg.name = projectName;

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
}

async function replacePlaceholders(
  targetDir: string,
  appName: string,
  packageName: string,
  webviewUrl: string
): Promise<void> {
  const replaceInFile = async (filePath: string) => {
    const content = await fs.readFile(filePath, 'utf-8');
    let updated = content
      .replace(/__APP_NAME__/g, appName)
      .replace(/__PACKAGE_NAME__/g, packageName)
      .replace(/__WEBVIEW_URL__/g, webviewUrl);

    await fs.writeFile(filePath, updated);
  };

  await traverseDirectory(targetDir, async (filePath) => {
    const ext = path.extname(filePath);
    if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext)) {
      await replaceInFile(filePath);
    }
  });
}

async function traverseDirectory(
  dir: string,
  callback: (filePath: string) => Promise<void>
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await traverseDirectory(fullPath, callback);
    } else {
      await callback(fullPath);
    }
  }
}

async function copyIcons(iconsSrc: string, targetDir: string): Promise<void> {
  const assetsDir = path.join(targetDir, 'assets', 'images');
  await fs.mkdir(assetsDir, { recursive: true });

  try {
    const entries = await fs.readdir(iconsSrc);
    for (const entry of entries) {
      const srcPath = path.join(iconsSrc, entry);
      const destPath = path.join(assetsDir, entry);
      await fs.copyFile(srcPath, destPath);
    }
  } catch (err) {
    logError(`Failed to copy icons from "${iconsSrc}"`);
  }
}