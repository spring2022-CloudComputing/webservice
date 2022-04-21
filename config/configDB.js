const env = process.env;
const fs = require('fs');
const rdsCa = fs.readFileSync('config/ca-bundle.pem');

const config = {
    db: {
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER || 'root',
        password: env.DB_PASSWORD || 'Qwerty@12345!',
        database: env.DB_NAME || 'usersDB',
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                ca: [rdsCa]
            }
        },
        port: 3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    METRICS_HOSTNAME: "localhost",
    METRICS_PORT: 8125
};

module.exports = config;