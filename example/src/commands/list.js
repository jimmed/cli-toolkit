import chalk from 'chalk';

export default {
  description: 'List the IDs of all Minecraft versions',
  args: {
    type: {
      type: 'string',
      options: ['release', 'snapshot', 'old_alpha', 'old_beta'],
    },
  },
  task: 'getVersionList',
  formatResult: ({ versions }, { type }) => {
    const title = type
      ? `Minecraft Versions from the "${chalk.white(type)}" Release Channel`
      : 'All Minecraft Versions';
    const filteredVersions = type
      ? versions.filter(version => version.type === type)
      : versions;
    return [
      chalk.bold.underline(title),
      ...filteredVersions.map(({ id }) => ` ${chalk.dim('-')} ${id}`),
    ];
  },
};
