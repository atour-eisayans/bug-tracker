const permissions = {
    item:{
        all: 'Item/*',
        add: 'Item/AddItem',
        remove: 'Item/RemoveItem',
        update: 'Item/UpdateItem',
        get: 'Item/GetItem',
        list: 'Item/ListItems',
    },
    account: {
        all: 'Account/*',
        create: 'Account/CreateAccount',
        addEmployee: 'Account/AddEmployee',
        remove: 'Account/RemoveAccount',
        modifyRole: 'Account/ModifyRole',
    },
    request: {
        all: 'Request/*',
        approveRequest: 'Request/ApproveRequest',
        listRequests: 'Request/ListRequests',
        getRequest: 'Request/GetRequest',
    }
};

Object.freeze(permissions);

module.exports = permissions;
