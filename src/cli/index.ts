import { init } from './init.js';
import { add } from './add.js';
import chalk from 'chalk';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      await init(args[1]);
      break;
    case 'add':
      await add(args.slice(1));
      break;
    default:
      printHelp();
      break;
  }
}

function printHelp() {
  console.log('');
  console.log('  ' + chalk.bold('caret-tui') + chalk.dim(' — Terminal UI for React'));
  console.log('');
  console.log('  ' + chalk.dim('Usage:'));
  console.log('    ' + chalk.cyan('caret-tui') + ' <command>');
  console.log('');
  console.log('  ' + chalk.dim('Commands:'));
  console.log('    ' + chalk.cyan('init') + ' [name]        ' + chalk.dim('Scaffold a new project'));
  console.log('    ' + chalk.cyan('add') + '  [components]  ' + chalk.dim('Copy component source into your project'));
  console.log('');
  console.log('  ' + chalk.dim('Examples:'));
  console.log('    ' + chalk.dim('npx caret-tui init my-app'));
  console.log('    ' + chalk.dim('npx caret-tui add badge card'));
  console.log('    ' + chalk.dim('npx caret-tui add'));
  console.log('');
}

main().catch((err: Error) => {
  console.error(chalk.red('\n  Error: ') + err.message);
  process.exit(1);
});
