// Modules
const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");
const QuizzesService = require("../services/quizzes-service");

// Configuration
const quizzesRouter = express.Router();
const jsonBodyParser = express.json();

// Define props that are required
const requiredProps = [
    // "id",  // Not required
    // "user_id",  // Not required
    "title",
    "author",
    "description",
    // "color_background", // Not required
    // "color_text", // Not required
    // "image_url", // Not required
    // "image_title", // Not required
    "final_message_low",
    "final_message_medium",
    "final_message_high",
    "final_message_perfect",
    // "date_modified", // Not required
];

// Handle GET, POST on / endpoint
quizzesRouter
    .route("/")
    .all(requireAuth)
    // Get all quizzes that belong to user
    .get((req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get quizzes, pass to response
        QuizzesService.getAllQuizzes(req.app.get("db"), user)
            .then((quizzes) => {
                // console.log("router", quizzes);
                res.json(QuizzesService.sanitizeQuizzes(quizzes));
            })
            .catch(next);
    })
    // Create new quiz for user
    .post(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get quiz info from request, create new quiz object
        const {
            title,
            author,
            description,
            color_background,
            color_text,
            image_url,
            image_title,
            final_message_low,
            final_message_medium,
            final_message_high,
            final_message_perfect,
        } = req.body;
        const newQuiz = QuizzesService.sanitizeQuiz({
            title,
            author,
            description,
            color_background,
            color_text,
            image_url,
            image_title,
            final_message_low,
            final_message_medium,
            final_message_high,
            final_message_perfect,
        });

        // Check to see if required quiz property is missing or no value is given
        for (const prop of requiredProps) {
            if (!req.body[prop] || req.body[prop] === "")
                return res.status(400).json({
                    error: {
                        message: `Missing '${prop}' in request body`,
                    },
                });
        }

        // Add user_id, date to quiz object
        newQuiz.user_id = user.id;
        newQuiz.date_modified = new Date().toISOString();

        // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        // Add quiz to database; return quiz path, info
        QuizzesService.insertQuiz(req.app.get("db"), newQuiz)
            .then((quiz) => {
                res.status(201)
                    // Add location but remove '/api' from string
                    .location(
                        path.posix.join(req.originalUrl.slice(4), `/${quiz.id}`)
                    )
                    .json(QuizzesService.sanitizeQuiz(quiz));
            })
            .catch(next);
    });

// Handle GET, DELETE, PATCH on /:quiz_id endpoint
quizzesRouter
    .route("/:quiz_id")
    .all(requireAuth)
    .all(checkQuizIdExists)
    // Return quiz info
    .get((req, res, next) => res.json(QuizzesService.sanitizeQuiz(res.quiz)))
    // Update quiz info
    .patch(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get updated info from request, create updated quiz object
        const {
            title,
            author,
            description,
            color_background,
            color_text,
            image_url,
            image_title,
            final_message_low,
            final_message_medium,
            final_message_high,
            final_message_perfect,
        } = req.body;
        const quizToUpdate = QuizzesService.sanitizeQuiz({
            title,
            author,
            description,
            color_background,
            color_text,
            image_url,
            image_title,
            final_message_low,
            final_message_medium,
            final_message_high,
            final_message_perfect,
        });

        // Check to see if required quiz property is missing or no value is given
        for (const prop of requiredProps) {
            if (!req.body[prop] || req.body[prop] === "")
                return res.status(400).json({
                    error: {
                        message: `Missing '${prop}' in request body`,
                    },
                });
        }

        quizToUpdate.date_modified = new Date().toISOString();

        // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        // Perform quiz update
        QuizzesService.updateQuiz(
            req.app.get("db"),
            req.params.quiz_id,
            quizToUpdate
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);

        // QuizzesService.hasQuizWithTitle(req.app.get("db"), user, title).then(
        //     (existingQuiz) => {
        //         // Check if there's an existing quiz with updated name that
        //         // isn't the current quiz
        //         if (!!existingQuiz) {
        //             if (existingQuiz.id !== id) {
        //                 return res.status(400).json({
        //                     error: {
        //                         message: `Quiz title '${title}' already used`,
        //                     },
        //                 });
        //             }
        //         }

        //         // Add date_modified field, update to now
        //         quizToUpdate.date_modified = new Date().toISOString();

        //         // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        //         // Perform quiz update
        //         QuizzesService.updateQuiz(
        //             req.app.get("db"),
        //             req.params.quiz_id,
        //             quizToUpdate
        //         )
        //             .then((numRowsAffected) => {
        //                 res.status(204).end();
        //             })
        //             .catch(next);
        //     }
        // );
    })
    // Delete quiz from database
    .delete((req, res, next) => {
        QuizzesService.deleteQuiz(req.app.get("db"), req.params.quiz_id)
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    });

/* async/await syntax for promises */
async function checkQuizIdExists(req, res, next) {
    try {
        const quiz = await QuizzesService.getById(
            req.app.get("db"),
            req.user,
            req.params.quiz_id
        );

        if (!quiz)
            return res.status(404).json({
                error: { message: `Quiz ID doesn't exist` },
            });

        res.quiz = quiz;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = quizzesRouter;
