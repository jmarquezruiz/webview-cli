import { Command } from 'commander';
import { showBanner, formatInstructions, logError } from './utils';
import { collectProjectDetails } from './prompts';
import { generateProject } from './generator';

export async function main(): Promise<void> {
  const program = new Command();

  program
    .name('create-webview-cli')
    .description('CLI to generate Expo WebView projects')
    .version('1.0.0')
    .action(async () => {
      try {
        await showBanner();
        const options = await collectProjectDetails();
        
        if (!options) {
          return;
        }

        await generateProject(options);
        formatInstructions(options.projectName);
      } catch (err) {
        logError(`Failed to generate project: ${err}`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}