// Modules
const QuestionsService = require("./questions-service");
const QuizBuilderService = require("./quiz-builder-service");

// Define columns to return for GET requests
const columns = [
    "id",
    "title",
    "author",
    "description",
    "color_background",
    "color_text",
    "image_url",
    "image_title",
    "final_message_low",
    "final_message_medium",
    "final_message_high",
    "final_message_perfect",
    "date_modified",
];

// Define props to sanitize
const sanitizeProps = [
    "title",
    "author",
    "description",
    "color_background",
    "color_text",
    "image_url",
    "image_title",
    "final_message_low",
    "final_message_medium",
    "final_message_high",
    "final_message_perfect",
];

const QuizzesService = {
    // Delete quiz from database
    deleteQuiz(db, id) {
        // return db.from(table).where({ id }).delete();
        return QuizBuilderService.deleteItem(db, "quizzes", id);
    },

    // Get all quizzes owned by user
    async getAllQuizzes(db, user) {
        try {
            // Get quizzes
            const quizzes = await QuizBuilderService.getAllItems(
                db,
                "quizzes",
                user,
                columns
            );

            // console.log("qs", quizzes);

            // Get quiz questions, add them to quiz
            const newQuizzes = [];
            // for..of required here because it is blocking while forEach is not with
            // async calls
            for (const quiz of quizzes) {
                const questions = await QuestionsService.getAllQuestionsByQuizId(
                    db,
                    user,
                    quiz.id
                );
                newQuizzes.push({
                    ...quiz,
                    questions: questions,
                });
            }
            return newQuizzes;
        } catch (error) {
            console.log(error);
        }
    },

    // Get quiz with given ID
    async getById(db, user, id) {
        // Get quiz
        const quiz = await QuizBuilderService.getById(
            db,
            "quizzes",
            user,
            id,
            columns
        );

        // Get questions for quiz
        const questions = await QuestionsService.getAllQuestionsByQuizId(
            db,
            user,
            id
        );

        // Add questions to quiz, if questions exist
        if (!!questions.length) {
            quiz.questions = questions;
        }

        return quiz;
        // return QuizBuilderService.getById(db, "quizzes", user, id, columns);
    },

    // Check if quiz name already used
    hasQuizWithTitle(db, user, title) {
        return QuizBuilderService.hasItemWithProp(
            db,
            "quizzes",
            user,
            "title",
            title
        );
    },

    // Insert new quiz into database
    insertQuiz(db, newQuiz) {
        return QuizBuilderService.insertItem(db, "quizzes", newQuiz);
    },

    // Remove any XSS attack scripts from multiple items
    sanitizeQuizzes(quizzes) {
        return quizzes.map((quiz) => this.sanitizeQuiz(quiz));
    },

    // Remove any XSS attack scripts from single item
    sanitizeQuiz(quiz) {
        const sanitizedQuiz = QuizBuilderService.sanitizeItem(
            quiz,
            sanitizeProps
        );

        // Adjust what gets returned below if necessary
        return {
            ...sanitizedQuiz,
        };
    },

    // Update item in database with new info
    updateQuiz(db, id, quizToUpdate) {
        return QuizBuilderService.updateItem(db, "quizzes", id, quizToUpdate);
    },
};

module.exports = QuizzesService;
