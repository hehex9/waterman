import argv from 'yargs'
import {watermark} from './waterman.js'

export function run() {
  const command = argv(process.argv.slice(2))
    .usage('Usage: waterman [options]')
    .option('file', {
      alias: 'f',
      type: 'string',
      describe: 'files to transform',
      demandOption: true,
    })
    .option('out', {alias: 'o', type: 'string', describe: 'out dir'})
    .option('verbose', {type: 'boolean', describe: 'display verbose output'})
    .option('text', {
      alias: 't',
      type: 'string',
      describe: 'watermark text',
      demandOption: true,
    })
    .default('out', '.')
    .version()
    .alias('h', 'help')
    .alias('version', 'v')
    .showHelpOnFail(false)
    .help('h')

  watermark(command.argv)
}
