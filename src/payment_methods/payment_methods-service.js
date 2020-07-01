// Modules
const xss = require("xss");

const Payment_methodsService = {
    // Create new payment method
    createPayment_method(db, newPayment_method) {
        return db
            .from("payment_methods")
            .insert(newPayment_method)
            .returning("*")
            .then((rows) => {
                return rows[0];
            });
    },

    // Delete payment method from database
    deletePayment_method(db, id) {
        return db.from("payment_methods").where({ id }).delete();
    },

    // Get all payment methods owned by user
    getAllPayment_methods(db, user) {
        return db
            .from("payment_methods AS pm")
            .select(
                "pm.id",
                "pm.payment_method_name",
                "pm.cycle_type",
                "pm.cycle_start",
                "pm.cycle_end",
                "pm.description",
                "pm.date_created",
                "pm.date_modified"
            )
            .where("pm.user_id", user.id);
    },

    // Get payment method with given ID
    getById(db, user, id) {
        return Payment_methodsService.getAllPayment_methods(db, user)
            .where("pm.id", id)
            .first();
    },

    // Check if payment method name already used
    hasPayment_methodWithName(db, user, payment_method_name) {
        return Payment_methodsService.getAllPayment_methods(db, user)
            .where("pm.payment_method_name", payment_method_name)
            .first();
        // .then((category) => !!category);
    },

    // Remove any XSS attack scripts from multiple payment methods
    sanitizePayment_methods(payment_methods) {
        return payment_methods.map(this.sanitizePayment_method);
    },

    // Remove any XSS attack scripts from single payment method
    sanitizePayment_method(payment_method) {
        return {
            ...payment_method,
            payment_method_name: xss(payment_method.payment_method_name),
            cycle_type: xss(payment_method.cycle_type),
            description: xss(payment_method.description),
        };
    },

    // Update payment method with new info
    updatePayment_method(db, id, paymentMethodToUpdate) {
        return db
            .from("payment_methods")
            .where({ id })
            .update(paymentMethodToUpdate);
    },
};

module.exports = Payment_methodsService;
