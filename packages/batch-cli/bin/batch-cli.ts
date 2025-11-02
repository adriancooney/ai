import { program } from 'commander';
import { resolve } from 'node:path';
import { BatchStore } from '@ai-sdk/batch';

program.name('batch-cli').description('manage ai batch jobs');

program
  .command('build')
  .requiredOption('--batch <filepath>', 'path to the batch impl', path =>
    resolve(process.cwd(), path),
  )
  .action(async () => {
    // import batch file
    // call build
    // accept any options like store or model
  });

function createFileStore(): BatchStore<any> {
  // Implements the batch store using the filesystem
}

program.parseAsync();
