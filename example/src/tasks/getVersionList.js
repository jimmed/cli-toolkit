const getVersionListTask = {
  description: 'Get list of versions from Minecraft API',
  async run(args, actions, { getVersionList }) {
    return getVersionList();
  },
};

export default getVersionListTask;
