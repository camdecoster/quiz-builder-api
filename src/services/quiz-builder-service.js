// Modules
const xss = require("xss");

const QuizBuilderService = {
    // Delete item from database
    deleteItem(db, table, id) {
        return db.from(table).where({ id }).delete();
    },

    // Get all items owned by user
    getAllItems(db, table, user, columns) {
        // console.log("`getAllItems` ran");
        return db
            .from(table)
            .select(columns)
            .where(`${table}.user_id`, user.id);
    },

    // Get item with given ID
    getById(db, table, user, id, columns) {
        // console.log("`getById` ran");
        // Don't need user ID since this is unprotected
        return db.from(table).select(columns).where(`${table}.id`, id).first();
    },

    // Check if item name already used
    hasItemWithProp(db, table, user, prop, propValue) {
        return this.getAllItems(db, table, user)
            .where(`${table}.${prop}`, propValue)
            .first();
    },

    // Insert new item into database
    insertItem(db, table, newItem) {
        return db
            .from(table)
            .insert(newItem)
            .returning("*")
            .then(([item]) => item);
    },

    // Remove any XSS attack scripts from multiple items
    sanitizeItems(items, props) {
        return items.map((item) => this.sanitizeItem(item, props));
    },

    // Remove any XSS attack scripts from single item
    sanitizeItem(item, props) {
        props.forEach((prop) => {
            // Check if value is array
            if (Array.isArray(item[prop])) {
                // If value is array, then remove scripts in each element
                for (let i = 0; i < item[prop].length; i++)
                    item[prop][i] = xss(item[prop][i]);
            } else {
                item[prop] = xss(item[prop]);
            }
        });
        return item;
    },

    // Update item in database with new info
    updateItem(db, table, id, itemToUpdate) {
        // console.log(id);
        return db.from(table).where({ id }).update(itemToUpdate);
    },
};

module.exports = QuizBuilderService;
