const accountTypes = require('../data/accountTypes');
const {
    account: accountPermissions,
    item: itemPermissions,
    request: requestPermissions,
} = require('../data/permissions');

module.exports = {
    port: 3000,
    db: {
        pg: {
            host: process.env.POSTGRES_HOST,
            dbName: process.env.POSTGRES_DB_NAME,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT,
            tableNames: {
                accounts: 'acocunts',
                roles: 'roles',
                items: 'items',
                requests: 'requests',
            },
            initialAccount: {
                name: 'Atour Eisayans',
                password: process.env.ADMIN_ACCOUNT_DEFAULT_PASSWORD,
                email: 'atour.admin@gmail.com',
            },
            initialRoles: {
                admin: {
                    title: 'admin',
                    permissions: [
                        accountPermissions.all,
                        requestPermissions.all,
                    ],
                    type: accountTypes.admin,
                },
                company: {
                    title: 'company',
                    permissions: [itemPermissions.all],
                    type: accountTypes.company,
                },
                employee: {
                    title: 'employee',
                    permissions: [
                        itemPermissions.add,
                        itemPermissions.get,
                        itemPermissions.list,
                        itemPermissions.update,
                    ],
                    type: accountTypes.employee,
                },
            },
        },
        mongodb: {
            connectionString: process.env.MONGODB_URI,
        },
        redis: {
            // Connection String template
            // redis[s]://[[username][:password]@][host][:port][/db-number]
            connectionString: process.env.REDIS_URI,
        },
    },
    hashSaltRounds: 10,
    permissionsPrefixes: {
        account: 'account',
        item: 'item',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        defaultTtl: 90000,
        accessToken: {
            ttl: 90000,
        },
        refreshToken: {
            ttl: 86400,
        },
    },
    resetPassword: {
        tokenBytes: 40,
        expiresIn: 3600,
    },
    cache: {
        ttl: 300, // it's in seconds
    }
};
