// Modules
const xss = require("xss");

const QuizBuilderService = {
    // Delete item from database
    deleteItem(db, table, id) {
        return db.from(table).where({ id }).delete();
    },

    // Get all items owned by user
    getAllItems(db, table, user, columns) {
        return db
            .from(table)
            .select(columns)
            .where(`${table}.user_id`, user.id);
    },

    // Get item with given ID
    getById(db, table, user, id, columns) {
        return this.getAllItems(db, table, user, columns)
            .where(`${table}.id`, id)
            .first();
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
        props.forEach((prop) => (item[prop] = xss(item[prop])));
        return item;
    },

    // Update item in database with new info
    updateItem(db, table, id, itemToUpdate) {
        return db.from(table).where({ id }).update(itemToUpdate);
    },
};

module.exports = QuizBuilderService;
