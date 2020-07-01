// Modules
const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");
const Payment_methodsService = require("./payment_methods-service");

// Configuration
const payment_methodsRouter = express.Router();
const jsonBodyParser = express.json();

// Handle GET, POST on / endpoint
payment_methodsRouter
    .route("/")
    .all(requireAuth)
    // Get all payment methods that belong to user
    .get((req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        Payment_methodsService.getAllPayment_methods(req.app.get("db"), user)
            .then((payment_methods) => {
                res.json(
                    Payment_methodsService.sanitizePayment_methods(
                        payment_methods
                    )
                );
            })
            .catch(next);
    })
    // Create new payment method for user
    .post(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get payment method info from request, create new payment method object
        const {
            payment_method_name,
            cycle_type,
            cycle_start,
            cycle_end,
            description,
        } = req.body;
        const newPayment_method = Payment_methodsService.sanitizePayment_method(
            {
                payment_method_name,
                cycle_type,
                cycle_start,
                cycle_end,
                description,
            }
        );

        // Check to see if required payment method property is missing
        for (const [key, value] of Object.entries(newPayment_method)) {
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` },
                });
        }

        // Check if payment method name already used
        Payment_methodsService.hasPayment_methodWithName(
            req.app.get("db"),
            user,
            payment_method_name
        ).then((existingPayment_method) => {
            if (!!existingPayment_method)
                return res.status(400).json({
                    error: {
                        message: `Payment method name '${payment_method_name}' already used`,
                    },
                });

            // Add user_id, date_created to payment method object
            newPayment_method.user_id = user.id;
            newPayment_method.date_created = new Date().toISOString();

            // Add payment method to database; return payment method path, info
            Payment_methodsService.createPayment_method(
                req.app.get("db"),
                newPayment_method
            )
                .then((payment_method) => {
                    res.status(201)
                        // Add location but remove '/api' from string
                        .location(
                            path.posix.join(
                                req.originalUrl.slice(4),
                                `/${payment_method.id}`
                            )
                        )
                        .json(payment_method);
                })
                .catch(next);
        });
    });

// Handle GET, DELETE, PATCH on /:payment_method_id endpoint
payment_methodsRouter
    .route("/:payment_method_id")
    .all(requireAuth)
    .all(checkPayment_methodIdExists)
    // Return payment method info
    .get((req, res, next) => {
        res.json(
            Payment_methodsService.sanitizePayment_method(res.payment_method)
        );
    })
    // Update payment method info
    .patch(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get updated info from request, create updated payment method object
        const {
            id,
            payment_method_name,
            cycle_type,
            cycle_start,
            cycle_end,
            description,
        } = req.body;
        const payment_methodToUpdate = Payment_methodsService.sanitizePayment_method(
            {
                payment_method_name,
                cycle_type,
                cycle_start,
                cycle_end,
                description,
            }
        );

        // Check to see if required payment method property is missing
        for (const [key, value] of Object.entries(payment_methodToUpdate)) {
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` },
                });
        }

        Payment_methodsService.hasPayment_methodWithName(
            req.app.get("db"),
            user,
            payment_method_name
        ).then((existingPayment_method) => {
            // Check if there's an existing payment method with updated name that
            // isn't the current payment method
            if (!!existingPayment_method) {
                if (existingPayment_method.id !== id) {
                    return res.status(400).json({
                        error: {
                            message: `Payment method name '${payment_method_name}' already used`,
                        },
                    });
                }
            }

            // Add date_modified field, update to now
            payment_methodToUpdate.date_modified = new Date().toISOString();

            // Perform payment method update
            Payment_methodsService.updatePayment_method(
                req.app.get("db"),
                req.params.payment_method_id,
                payment_methodToUpdate
            )
                .then((numRowsAffected) => {
                    res.status(204).end();
                })
                .catch(next);
        });
    })
    // Delete payment method from database
    .delete((req, res, next) => {
        Payment_methodsService.deletePayment_method(
            req.app.get("db"),
            req.params.payment_method_id
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    });

/* async/await syntax for promises */
async function checkPayment_methodIdExists(req, res, next) {
    try {
        const payment_method = await Payment_methodsService.getById(
            req.app.get("db"),
            req.user,
            req.params.payment_method_id
        );

        if (!payment_method)
            return res.status(404).json({
                error: `Payment Method doesn't exist`,
            });

        res.payment_method = payment_method;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = payment_methodsRouter;
