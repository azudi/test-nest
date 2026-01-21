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
  corsUrls: process.env.CORS_URLS ? process.env.CORS_URLS?.split(',').map(origin => origin.trim()) : [],
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ttl: parseInt(process.env.REDIS_TTL || '60'),
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  paystack: {
    secrete_key: process.env.PAYSTACK_API_KEY,
  }
});


