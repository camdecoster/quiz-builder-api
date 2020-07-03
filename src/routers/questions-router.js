// Modules
const express = require("express");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");
const QuestionsService = require("../services/questions-service");

// Configuration
const questionsRouter = express.Router();
const jsonBodyParser = express.json();

// Define props that are required
const requiredProps = [
    // "id", // Not required
    // "user_id", // Not required
    "quiz_id",
    "question",
    "answer_index",
    "answers",
    // "color_background", // Not required
    // "color_text", // Not required
    // "image_url", // Not required
    // "image_title", // Not required
    // "date_modified", // Not required
];

// Handle GET, POST on / endpoint
questionsRouter
    .route("/")
    .all(requireAuth)
    // Get all questions that belong to user
    .get((req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        QuestionsService.getAllQuestions(req.app.get("db"), user)
            .then((questions) => {
                res.json(QuestionsService.sanitizeQuestions(questions));
            })
            .catch(next);
    })
    // Create new question for user
    .post(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get question info from request, create new question object
        const {
            quiz_id,
            question,
            answer_index,
            answers,
            color_background,
            color_text,
            image_url,
            image_title,
        } = req.body;
        const newQuestion = QuestionsService.sanitizeQuestion({
            quiz_id,
            question,
            answer_index,
            answers,
            color_background,
            color_text,
            image_url,
            image_title,
        });

        for (const prop of requiredProps) {
            if (req.body[prop] === undefined || req.body[prop] === "")
                return res.status(400).json({
                    error: {
                        message: `Missing '${prop}' in request body`,
                    },
                });
        }

        // Add user_id, date to question object
        newQuestion.user_id = user.id;
        newQuestion.date_modified = new Date().toISOString();

        // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        // Add question to database; return question path, info
        QuestionsService.insertQuestion(req.app.get("db"), newQuestion)
            .then((question) => {
                res.status(201)
                    // Add location but remove '/api' from string
                    .location(
                        path.posix.join(
                            req.originalUrl.slice(4),
                            `/${question.id}`
                        )
                    )
                    .json(QuestionsService.sanitizeQuestion(question));
            })
            .catch(next);
    });

// Handle GET, DELETE, PATCH on /:question_id endpoint
questionsRouter
    .route("/:question_id")
    .all(requireAuth)
    .all(checkQuestionIdExists)
    // Return question info
    .get((req, res, next) =>
        res.json(QuestionsService.sanitizeQuestion(res.question))
    )
    // Update question info
    .patch(jsonBodyParser, (req, res, next) => {
        // Get user info from auth check
        const { user } = req;

        // Get updated info from request, create updated question object
        const {
            quiz_id,
            question,
            answer_index,
            answers,
            color_background,
            color_text,
            image_url,
            image_title,
        } = req.body;
        const questionToUpdate = QuestionsService.sanitizeQuestion({
            quiz_id,
            question,
            answer_index,
            answers,
            color_background,
            color_text,
            image_url,
            image_title,
        });

        // Check to see if required question property is missing or no value is given
        for (const prop of requiredProps) {
            if (req.body[prop] === undefined || req.body[prop] === "")
                return res.status(400).json({
                    error: {
                        message: `Missing '${prop}' in request body`,
                    },
                });
        }

        questionToUpdate.date_modified = new Date().toISOString();

        // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        // Perform question update
        QuestionsService.updateQuestion(
            req.app.get("db"),
            req.params.question_id,
            questionToUpdate
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);

        // QuestionsService.hasQuestionWithTitle(req.app.get("db"), user, title).then(
        //     (existingQuestion) => {
        //         // Check if there's an existing question with updated name that
        //         // isn't the current question
        //         if (!!existingQuestion) {
        //             if (existingQuestion.id !== id) {
        //                 return res.status(400).json({
        //                     error: {
        //                         message: `Question title '${title}' already used`,
        //                     },
        //                 });
        //             }
        //         }

        //         // Add date_modified field, update to now
        //         questionToUpdate.date_modified = new Date().toISOString();

        //         // CONSIDER CHECKING FOR LEADING SPACES ON INPUTS

        //         // Perform question update
        //         QuestionsService.updateQuestion(
        //             req.app.get("db"),
        //             req.params.question_id,
        //             questionToUpdate
        //         )
        //             .then((numRowsAffected) => {
        //                 res.status(204).end();
        //             })
        //             .catch(next);
        //     }
        // );
    })
    // Delete question from database
    .delete((req, res, next) => {
        QuestionsService.deleteQuestion(
            req.app.get("db"),
            req.params.question_id
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    });

/* async/await syntax for promises */
async function checkQuestionIdExists(req, res, next) {
    // console.log("`checkQuestionIdExists` ran");
    try {
        const question = await QuestionsService.getById(
            req.app.get("db"),
            req.user,
            req.params.question_id
        );

        if (!question)
            return res.status(404).json({
                error: { message: `Question ID doesn't exist` },
            });

        res.question = question;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = questionsRouter;
