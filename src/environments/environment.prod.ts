import packageInfo from '../../package.json';

export const environment = {
  apiUrl: "http://127.0.0.1:8000/statusboardapi",
  appVersion: packageInfo.version,
  production: true
};
