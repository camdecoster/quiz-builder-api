// Modules
const express = require("express");
const path = require("path");
const UsersService = require("../services/users-service");

// Configuration
const usersRouter = express.Router();
const jsonBodyParser = express.json();

// The only endpoint should be POST for /api/users
usersRouter.post("/", jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body;

    for (const inputField of ["email", "password"])
        if (!req.body[inputField])
            return res.status(400).json({
                error: `Missing '${inputField}' in request body`,
            });

    // Check if password passes validation logic
    const passwordError = UsersService.validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    // Check if email already used; if not, continue with adding user
    UsersService.hasUserWithEmail(req.app.get("db"), email)
        .then((hasUserWithEmail) => {
            if (hasUserWithEmail)
                return res.status(400).json({ error: `Email already taken` });

            // Hash password
            return UsersService.hashPassword(password).then(
                (hashedPassword) => {
                    // Create new user with hashed password
                    const newUser = {
                        email,
                        password: hashedPassword,
                        date_modified: "now()",
                    };

                    // Add user to DB
                    return UsersService.insertUser(
                        req.app.get("db"),
                        newUser
                    ).then((user) => {
                        res.status(201)
                            .location(
                                path.posix.join(req.originalUrl, `/${user.id}`)
                            )
                            .json(UsersService.sanitizeUser(user));
                    });
                }
            );
        })
        .catch(next);
});

module.exports = usersRouter;
