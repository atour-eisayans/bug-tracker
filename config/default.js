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
            host: '127.0.0.1',
            dbName: 'bug_tracker',
            username: 'postgres',
            password: '1206318',
            port: 5432,
            tableNames: {
                accounts: 'acocunts',
                roles: 'roles',
                items: 'items',
                requests: 'requests',
            },
            initialAccount: {
                name: 'Atour Eisayans',
                password: '123456',
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
            connectionString: 'mongodb://127.0.0.1:27017/bugTracker',
        },
    },
    hashSaltRounds: 10,
    permissionsPrefixes: {
        account: 'account',
        item: 'item',
    },
    jwt: {
        secret: 'some-secret-phrase',
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
};
