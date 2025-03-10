import * as config from 'config';

export const jwtSecret: string =
  process.env.JWT_SECRET || config.get('Secret.jwtKey');
export const appPort = process.env.PORT || config.get('Application.port');
export const tokenExpired =
  process.env.TOKEN_EXPIRED || config.get('Application.tokenExpired');
export const refreshTokenExpired =
  process.env.REFRESH_TOKEN_EXPIRED ||
  config.get('Application.refreshTokenExpired');
export const apiVersion =
  process.env.API_VERSION || config.get('Application.version');
export const isDevMode = process.env.NODE_ENV === 'dev';
