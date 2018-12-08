import createCli from 'cli-toolkit';
import * as commands from './commands';
import * as tasks from './tasks';
import * as context from './api';

const myCli = createCli({
  name: 'Minecraft Version Lookup',
  defaultCommand: 'list',
  commands,
  tasks,
});

myCli({ context });
