import { bold, cyan, green, red } from 'kleur';
import figlet from 'figlet';
import { promisify } from 'util';

const figletPromise = promisify(figlet);

export async function showBanner(): Promise<void> {
  const banner = (await figletPromise('WebView-CLI')) ?? '';
  console.log(cyan(banner));
  console.log(red('jmarquez.dev'));
  console.log('');
}

export function logSuccess(message: string): void {
  console.log(green(`✔ ${message}`));
}

export function logError(message: string): void {
  console.error(red(`✘ ${message}`));
}

export function logInfo(message: string): void {
  console.log(cyan(message));
}

export function formatInstructions(projectName: string): void {
  console.log('\n' + bold('Instructions:'));
  console.log(cyan(`  cd ${projectName}`));
  console.log(cyan('  pnpm install'));
  console.log(cyan('  pnpm expo install'));
  console.log(cyan('  pnpm start'));
}