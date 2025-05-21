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
        400:{
            SSO_ONLY_ACTIVATED: undefined,
        },
        500: {
            SERVER_ERROR: 'api.error',
        },
    },
    '/logout': {
        401: {
            AUTHENTICATION_FAILED: 'invoice.invoice_profile',
        },
        500: {
            SERVER_ERROR: 'api.error',
        },
    },
    '/otp': {
        401: {
            AUTHENTICATION_FAILED: undefined,
            OTP_NOT_MATCHING: undefined,
            OTP_EXPIRED: undefined,
            OTP_TOO_MANY_ATTEMPTS: undefined,
            DEFAULT: undefined,
        },
    },
    '/accounts': {
        400: {
            NOT_FOUND: 'error.accountNotFound',
        },
        500: {
            SERVER_ERROR: 'api.error',
        },
    },
    '/tokens': {
        403: {
            AUTHORIZATION_FAILED: 'errors.login.not_authorized',
        },
    },
    '/users': {
        400: {
            VALIDATION_FAILED: 'errors.login.not_authorized',
        },
    },
};
