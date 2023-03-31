const config = require('config');
const pgClient = require('../../db/pg/pg.client');
const { DatabaseError } = require('../../errors');

const { items: itemsTbl = null, accounts: accountsTbl = null } =
    config.get('db.pg.tableNames');

if (!itemsTbl || !accountsTbl) throw new Error('something bad happened!');

const insertOne = async (itemDetails) => {
    try {
        const [itemId = null] = await pgClient
            .insert(itemDetails)
            .into(itemsTbl)
            .returning('id');

        return itemId;
    } catch (error) {
        throw new DatabaseError('Failed saving data in db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findCompanyItems = async (companyId, { limit, offset }) => {
    try {
        const items = await pgClient
            .select(
                'items.id as id',
                'items.type as type',
                'items.title as title',
                'items.description as description',
                'items.priority as priority',
                'items.creator as creator_id',
                'items.assignee as assignee_id',
                'items.status as status',
                'items.due_date as due_date',
                'creator_account.name as creator_name',
                'creator_account.email as creator_email'
            )
            .from(`${itemsTbl} as items`)
            .innerJoin(
                `${accountsTbl} as creator_account`,
                `items.creator`,
                `creator_account.id`
            )
            .where('creator_account.id', companyId)
            .orWhere('creator_account.parent', companyId)
            .limit(limit)
            .offset(offset);

        return items;
    } catch (error) {
        throw new DatabaseError('Failed fetching data from db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findByIdDetailed = async (itemId) => {
    try {
        const [item = null] = await pgClient
            .select(
                'items.id as id',
                'items.type as type',
                'items.title as title',
                'items.description as description',
                'items.priority as priority',
                'items.creator as creator_id',
                'items.assignee as assignee_id',
                'creator_profile.name as creator_name',
                'creator_profile.email as creator_email',
                'assignee_profile.name as assignee_name',
                'assignee_profile.email as assignee_email',
                'items.status as status',
                'items.due_date as due_date',
                'items.created_at as created_at'
            )
            .from(`${itemsTbl} as items`)
            .innerJoin(
                `${accountsTbl} as creator_profile`,
                `items.creator`,
                `creator_profile.id`
            )
            .innerJoin(
                `${accountsTbl} as assignee_profile`,
                `items.assignee`,
                `assignee_profile.id`
            )
            .where('items.id', itemId);

        return item;
    } catch (error) {
        throw new DatabaseError('Failed fetching data from db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findById = async (itemId) => {
    try {
        const [item = null] = await pgClient
            .select('*')
            .from(itemsTbl)
            .where('id', itemId);

        return item;
    } catch (error) {
        throw new DatabaseError('Failed fetching data from db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const update = async (itemId, itemDetails) => {
    try {
        const [item = null] = await pgClient(itemsTbl)
            .where('id', itemId)
            .update({
                type: itemDetails.type,
                title: itemDetails.title,
                description: itemDetails.description,
                priority: itemDetails.priority,
                assignee: itemDetails.assignee,
                status: itemDetails.status,
                due_date: itemDetails.dueDate || itemDetails.due_date,
            })
            .returning([
                'id',
                'title',
                'description',
                'priority',
                'assignee',
                'status',
                'due_date',
            ]);

        return item;
    } catch (error) {
        throw new DatabaseError('Failed saving data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

module.exports = {
    insertOne,
    findByIdDetailed,
    findCompanyItems,
    update,
    findById,
};
