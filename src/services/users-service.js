// Modules
const xss = require("xss");
const bcrypt = require("bcryptjs");

const QuizBuilderService = require("./quiz-builder-service");

// Password must include lowercase letter, uppercase letter, digit, and given symbol
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

// Define props to sanitize
const sanitizeProps = ["email"];

const UsersService = {
    // Check if email already used
    hasUserWithEmail(db, email) {
        return db("users")
            .where({ email })
            .first()
            .then((user) => !!user);
    },
    // Insert new user into DB
    insertUser(db, newUser) {
        return QuizBuilderService.insertItem(db, "users", newUser);
    },
    // Check if password passes validation logic
    validatePassword(password) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (password.length > 72) {
            return "Password must be at most 72 characters";
        }
        if (password.startsWith(" ") || password.endsWith(" ")) {
            return "Password must not start or end with empty spaces";
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return "Password must contain 1 upper case, lower case, number and special character";
        }
        return null;
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    // Remove XSS code if user is trying to inject it
    sanitizeUser(user) {
        const sanitizedUser = QuizBuilderService.sanitizeItem(
            user,
            sanitizeProps
        );

        return {
            id: sanitizedUser.id,
            email: xss(sanitizedUser.email),
            date_modified: new Date(sanitizedUser.date_modified),
        };
    },
};

module.exports = UsersService;
