const findCommand = (commands, commandName) => commands.find(({ id }) => id === commandName);

export default findCommand;
