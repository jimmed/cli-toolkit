import { fetchJson } from '../util';

const manifestUrl = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
const getVersionList = () => fetchJson(manifestUrl);

export default getVersionList;
