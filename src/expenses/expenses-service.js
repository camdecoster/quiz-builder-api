// Modules
const xss = require("xss");

const ExpensesService = {
    // Create new expense
    createExpense(db, newExpense) {
        return db
            .from("expenses")
            .insert(newExpense)
            .returning("*")
            .then((rows) => {
                return rows[0];
            });
    },

    // Delete expense from database
    deleteExpense(db, id) {
        return db.from("expenses").where({ id }).delete();
    },

    // Get all expenses owned by user
    getAllExpenses(db, user) {
        return db
            .from("expenses AS expense")
            .select(
                "expense.id",
                "expense.date",
                "expense.type",
                "expense.amount",
                "expense.payee",
                "expense.category",
                "expense.payment_method",
                "expense.description",
                "expense.date_created",
                "expense.date_modified"
            )
            .where("expense.user_id", user.id);
    },

    // Get expense with given ID
    getById(db, user, id) {
        return ExpensesService.getAllExpenses(db, user)
            .where("expense.id", id)
            .first();
    },

    // Remove any XSS attack scripts from multiple expenses
    sanitizeExpenses(expenses) {
        return expenses.map(this.sanitizeExpense);
    },

    // Remove any XSS attack scripts from single expense
    sanitizeExpense(expense) {
        return {
            ...expense,
            type: xss(expense.type),
            payee: xss(expense.payee),
            description: xss(expense.description),
        };
    },

    // Update expense with new info
    updateExpense(db, id, expenseToUpdate) {
        return db.from("expenses").where({ id }).update(expenseToUpdate);
    },
};

module.exports = ExpensesService;
