// Modules
const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");
const ExpensesService = require("./expenses-service");

// Configuration
const expensesRouter = express.Router();
const jsonBodyParser = express.json();

// Handle GET, POST on / endpoint
expensesRouter
    .route("/")
    .all(requireAuth)
    // Get all expenses that belong to user
    .get((req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        ExpensesService.getAllExpenses(req.app.get("db"), user)
            .then((expenses) => {
                res.json(ExpensesService.sanitizeExpenses(expenses));
            })
            .catch(next);
    })
    // Create new expenses for user
    .post(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get expense info from request, create new expense object
        const {
            date,
            type,
            amount,
            payee,
            category,
            payment_method,
            description,
        } = req.body;
        const newExpense = ExpensesService.sanitizeExpense({
            date,
            type,
            amount,
            payee,
            description,
        });

        // Check to see if required expense property is missing
        for (const [key, value] of Object.entries(newExpense)) {
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` },
                });
        }

        // Add category, payment method to expense object
        newExpense.category = category;
        newExpense.payment_method = payment_method;

        // Add user_id, date_created to expense object
        newExpense.user_id = user.id;
        newExpense.date_created = new Date().toISOString();

        // Add expense to database; return expense path, info
        ExpensesService.createExpense(req.app.get("db"), newExpense)
            .then((expense) => {
                res.status(201)
                    // Add location but remove '/api' from string
                    .location(
                        path.posix.join(
                            req.originalUrl.slice(4),
                            `/${expense.id}`
                        )
                    )
                    .json(ExpensesService.sanitizeExpense(expense));
            })
            .catch(next);
    });

// Handle GET, DELETE, PATCH on /:expense_id endpoint
expensesRouter
    .route("/:expense_id")
    .all(requireAuth)
    .all(checkExpenseExists)
    // Return expense info
    .get((req, res, next) => {
        res.json(ExpensesService.sanitizeExpense(res.expense));
    })
    // Update expense info
    .patch(jsonBodyParser, (req, res, next) => {
        // Get updated info from request, create updated expense object
        const {
            date,
            type,
            amount,
            payee,
            category,
            payment_method,
            description,
        } = req.body;
        const expenseToUpdate = ExpensesService.sanitizeExpense({
            date,
            type,
            amount,
            payee,
            description,
        });

        // Check to see if required expense property is missing
        for (const [key, value] of Object.entries(expenseToUpdate)) {
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` },
                });
        }

        // Add category, payment method to expense object
        expenseToUpdate.category = category;
        expenseToUpdate.payment_method = payment_method;

        // Add date_modified field, update to now
        expenseToUpdate.date_modified = new Date().toISOString();

        // Perform expense update
        ExpensesService.updateExpense(
            req.app.get("db"),
            req.params.expense_id,
            expenseToUpdate
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    })
    // Delete expense from database
    .delete((req, res, next) => {
        ExpensesService.deleteExpense(req.app.get("db"), req.params.expense_id)
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    });

/* async/await syntax for promises */
async function checkExpenseExists(req, res, next) {
    try {
        const expense = await ExpensesService.getById(
            req.app.get("db"),
            req.user,
            req.params.expense_id
        );

        if (!expense)
            return res.status(404).json({
                error: `Expense doesn't exist`,
            });

        res.expense = expense;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = expensesRouter;
