import packageInfo from '../../package.json';

export const environment = {
  apiUrl: "http://127.0.0.1:8000/securevaultapi",
  nodeUrl: "http://192.168.5.100",
  auNodeUrl: "http://10.8.4.100",
  appVersion: packageInfo.version,
  production: true
};
