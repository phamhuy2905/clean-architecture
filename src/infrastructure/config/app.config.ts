import { config } from 'dotenv';

config({ path: `${__dirname}/.env.${process.env.NODE_ENV || 'development'}` });


const CONFIG = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET,

    ACCESS_EXPIRATION: process.env.ACCESS_EXPIRATION,
    REFRESH_EXPIRATION: process.env.REFRESH_EXPIRATION,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_REDIRECT_URL: process.env.GOOGLE_CLIENT_REDIRECT_URL_CALLBACK,
    GOOGLE_CLIENT_REDIRECT_URL_CALLBACK: process.env.GOOGLE_CLIENT_REDIRECT_URL_CALLBACK,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,

    FRONTEND_URL: process.env.FRONTEND_URL,
};

export default CONFIG;