const {
    account: accountPermissions,
    item: itemPermissions,
} = require('../data/permissions');

module.exports = {
    port: 3000,
    db: {
        pg: {
            host: '127.0.0.1',
            dbName: 'bug_tracker_test',
            username: 'postgres',
            password: '1206318',
            port: 5432,
            tableNames: {
                accounts: 'acocunts',
                roles: 'roles',
                items: 'items',
            },
            initialAccount: {
                name: 'Atour Eisayans',
                password: '123456',
                email: 'atour.admin@gmail.com',
            },
            initialRoles: {
                admin: {
                    title: 'admin',
                    permissions: [accountPermissions.all],
                },
                company: {
                    title: 'company',
                    permissions: [itemPermissions.all],
                },
            },
        },
    },
    hashSaltRounds: 10,
    permissionsPrefixes: {
        account: 'account',
        item: 'item',
    },
    jwt: {
        secret: 'some-secret-phrase',
        defaultTtl: 9000,
        accessToken: {
            ttl: 900,
        },
        refreshToken: {
            ttl: 86400,
        },
    },
};
