const env = process.env.NODE_ENV || 'development';

module.exports = {
    isProduction: env === 'production',
    getEnv: () => env,
};
