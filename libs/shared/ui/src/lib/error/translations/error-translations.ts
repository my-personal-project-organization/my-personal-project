/* eslint-disable sort-keys */
export const errorTranslations = {
  '/login': {
    401: {
      AUTHENTICATION_FAILED: undefined,
      INVALID_PASSWORD: undefined,
      INVALID_ACCESS_DATA: undefined,
      INVALID_PASSWORD_USER_LOCKED: undefined,
      AUTHORIZATION_FAILED: undefined,
      NOT_ACTIVE: undefined,
      USER_LOCKED: undefined,
      PASSWORD_EXPIRED: undefined,
      DEFAULT: 'errors.login.invalid_access_data',
    },
    400: {
      SSO_ONLY_ACTIVATED: undefined,
    },
    500: {
      SERVER_ERROR: 'api.error',
    },
  },
};
