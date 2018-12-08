import chalk from 'chalk';

export default {
  description: 'Get information about a specific Minecraft version',
  args: {
    id: {
      type: 'string',
      position: 0,
      required: true,
      description: 'The Minecraft version to look up',
      prompt: 'Which version of Minecraft?',
    },
  },
  task: 'getVersionInfo',
  formatResult: ({ id, type, releaseDate }) => [
    chalk.bold.underline(`Minecraft Version ${id}`),
    chalk.white('Type: ', chalk.bold(type)),
    chalk.white(
      'Release Date: ',
      chalk.bold(new Date(releaseDate).toLocaleDateString()),
    ),
  ],
};
