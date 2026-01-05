export default () => ({
  database: {
    connectionString: process.env.MONGO_URL,
  },
  jwt: {
    secret: process.env.SECRETE_KEY_JWT,
  },
  email: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
});


