import createCli from 'cli-toolkit/dist/createCli';
import * as commands from './commands';

const myCli = createCli({
  name: 'Minecraft Version Lookup',
  commands,
});

myCli();
