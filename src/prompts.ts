import { text, confirm, outro, select } from '@clack/prompts';
import { cancel as clackCancel } from '@clack/prompts';
import { red } from 'kleur';

export interface ProjectOptions {
  appName: string;
  projectName: string;
  packageName: string;
  webviewUrl: string;
  addIcons: boolean;
  iconsPath?: string;
  packageManager: 'pnpm' | 'npm' | 'yarn';
  installDependencies: boolean;
}

function normalizeInput(value: string | symbol | undefined, defaultValue: string): string {
  if (typeof value === 'symbol' || value === undefined) {
    return defaultValue;
  }
  return value.trim() || defaultValue;
}

export async function collectProjectDetails(): Promise<ProjectOptions | null> {
  const appNameInput = await text({
    message: 'What is the name of your app?',
    placeholder: 'My WebView App',
    initialValue: 'My WebView App',
  });

  if (typeof appNameInput === 'symbol') return null;
  const appName = normalizeInput(appNameInput, 'My WebView App');

  const projectNameInput = await text({
    message: 'What is the project folder name?',
    placeholder: 'my-webview-app',
    initialValue: appName.toLowerCase().replace(/\s+/g, '-'),
  });

  if (typeof projectNameInput === 'symbol') return null;
  const projectName = normalizeInput(projectNameInput, appName.toLowerCase().replace(/\s+/g, '-'));

  const packageNameInput = await text({
    message: 'What is the package name?',
    placeholder: 'com.company.app',
    initialValue: 'com.company.app',
  });

  if (typeof packageNameInput === 'symbol') return null;
  const packageName = normalizeInput(packageNameInput, 'com.company.app');

  const webviewUrlInput = await text({
    message: 'What is the WebView URL?',
    placeholder: 'https://example.com',
    initialValue: 'https://example.com',
  });

  if (typeof webviewUrlInput === 'symbol') return null;
  const webviewUrlRaw = normalizeInput(webviewUrlInput, 'https://example.com');
  const webviewUrl = webviewUrlRaw.startsWith('http') ? webviewUrlRaw : `https://${webviewUrlRaw}`;

  const addIcons = await confirm({
    message: 'Do you want to add custom icons?',
    initialValue: false,
  });

  if (typeof addIcons === 'symbol') return null;

  let iconsPath: string | undefined;
  if (addIcons) {
    const icons = await text({
      message: 'Enter the path to your icons folder:',
      placeholder: './icons',
      initialValue: './icons',
    });

    if (typeof icons === 'symbol') return null;
    iconsPath = normalizeInput(icons, './icons');
  }

  const installDeps = await confirm({
    message: 'Do you want to install dependencies?',
    initialValue: true,
  });

  if (typeof installDeps === 'symbol') return null;

  let packageManager: 'pnpm' | 'npm' | 'yarn' = 'pnpm';
  if (installDeps) {
    const pkgManager = await select({
      message: 'Which package manager do you want to use?',
      options: [
        { value: 'pnpm', label: 'pnpm' },
        { value: 'npm', label: 'npm' },
        { value: 'yarn', label: 'yarn' },
      ],
      initialValue: 'pnpm',
    });

    if (typeof pkgManager === 'symbol') return null;
    packageManager = pkgManager as 'pnpm' | 'npm' | 'yarn';
  }

  return {
    appName,
    projectName,
    packageName,
    webviewUrl,
    addIcons: addIcons as boolean,
    iconsPath,
    packageManager,
    installDependencies: installDeps as boolean,
  };
}

export function cancelOperation(): void {
  clackCancel('Operation cancelled.');
  process.exit(0);
}