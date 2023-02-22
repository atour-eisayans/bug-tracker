const roleModel = require('../DALs/role.dal');
const { NotFoundError } = require('../../errors');

const getRoleByType = async (roleType) => {
    const role = await roleModel.findByType(roleType);

    if (!role) {
        throw new NotFoundError('Role not found');
    }

    return {
        id: role.id,
        title: role.title,
        permissions: role.permissions,
    };
};

module.exports = {
    getRoleByType,
};
