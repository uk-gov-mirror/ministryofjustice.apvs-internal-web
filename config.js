module.exports = {
  LOGGING_PATH: process.env.LOGGING_PATH,

  // DB
  DATABASE_SERVER: process.env.APVS_DATABASE_SERVER,
  DATABASE: process.env.APVS_DATABASE,
  INT_WEB_USERNAME: process.env.APVS_INT_WEB_USERNAME,
  INT_WEB_PASSWORD: process.env.APVS_INT_WEB_PASSWORD,
  INT_MIGRATION_USERNAME: process.env.APVS_INT_MIGRATION_USERNAME,
  INT_MIGRATION_PASSWORD: process.env.APVS_INT_MIGRATION_PASSWORD,

  // MoJ SSO
  AUTHENTICATION_ENABLED: process.env.APVS_MOJ_SSO_AUTHENTICATION_ENABLED || false,
  SESSION_SECRET: process.env.APVS_MOJ_SSO_SESSION_SECRET || 'apvs-internal-web',
  ORGANISATION: process.env.APVS_MOJ_SSO_ORGANISATION,
  CLIENT_ID: process.env.APVS_MOJ_SSO_CLIENT_ID,
  CLIENT_SECRET: process.env.APVS_MOJ_SSO_CLIENT_SECRET,
  TOKEN_HOST: process.env.APVS_MOJ_SSO_TOKEN_HOST,
  TOKEN_PATH: process.env.APVS_MOJ_SSO_TOKEN_PATH,
  AUTHORIZE_PATH: process.env.APVS_MOJ_SSO_AUTHORIZE_PATH,
  REDIRECT_URI: process.env.APVS_MOJ_SSO_REDIRECT_URI,
  USER_DETAILS_PATH: process.env.APVS_MOJ_SSO_USER_DETAILS_PATH,
  LOGOUT_PATH: process.env.APVS_MOJ_SSO_LOGOUT_PATH,
  TEST_SSO_EMAIL: process.env.APVS_MOJ_SSO_TEST_SSO_EMAIL,
  TEST_SSO_PASSWORD: process.env.APVS_MOJ_SSO_TEST_SSO_PASSWORD,

  // File upload
  FILE_UPLOAD_LOCATION: process.env.FILE_UPLOAD_LOCATION || './uploads'
}
