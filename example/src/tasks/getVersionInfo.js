const getVersionInfoTask = {
  description: ({ id }) => `Look up Minecraft version ${id}`,
  async run({ id }, { addChildTask }) {
    const { versions } = await addChildTask('getVersionList');
    return versions.find(version => version.id === id);
  },
};

export default getVersionInfoTask;
