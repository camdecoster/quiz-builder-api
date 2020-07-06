// Modules
const QuizBuilderService = require("./quiz-builder-service");

// Define columns to return for GET requests
const columns = [
    "id",
    "quiz_id",
    "question",
    "index_quiz_order",
    "answer_index",
    "answers",
    "color_background",
    "color_text",
    "image_url",
    "image_title",
    "date_modified",
];

// Define props to sanitize
const sanitizeProps = [
    // "id",
    // "quiz_id",
    "question",
    // "index_quiz_order",
    // "answer_index",
    "answers",
    "color_background",
    "color_text",
    "image_url",
    "image_title",
    // "date_modified",
];

const QuestionsService = {
    // Delete question from database
    deleteQuestion(db, id) {
        // return db.from(table).where({ id }).delete();
        return QuizBuilderService.deleteItem(db, "questions", id);
    },

    // Get all questions owned by user
    getAllQuestions(db, user) {
        // console.log("`getAllQuestions` ran");
        return QuizBuilderService.getAllItems(db, "questions", user, columns);
    },

    // Get question with given quiz ID
    getAllQuestionsByQuizId(db, user, id) {
        return db
            .from("questions")
            .select(columns)
            .where("questions.quiz_id", id)
            .orderBy("index_quiz_order", "asc");
        // return this.getAllQuestions(db, user).where("questions.quiz_id", id);
    },

    // Get question with given ID
    getById(db, user, id) {
        return QuizBuilderService.getById(db, "questions", user, id, columns);
    },

    // Check if question text already used
    hasQuestionWithText(db, user, text) {
        return QuizBuilderService.hasItemWithProp(
            db,
            "questions",
            user,
            "question",
            text
        );
    },

    // Insert new question into database
    insertQuestion(db, newQuestion) {
        return QuizBuilderService.insertItem(db, "questions", newQuestion);
    },

    // Remove any XSS attack scripts from multiple items
    sanitizeQuestions(questions) {
        return questions.map((question) => this.sanitizeQuestion(question));
    },

    // Remove any XSS attack scripts from single item
    sanitizeQuestion(question) {
        const sanitizedQuestion = QuizBuilderService.sanitizeItem(
            question,
            sanitizeProps
        );

        // Adjust what gets returned below if necessary
        return {
            ...sanitizedQuestion,
        };
    },

    // Update item in database with new info
    updateQuestion(db, id, questionToUpdate) {
        return QuizBuilderService.updateItem(
            db,
            "questions",
            id,
            questionToUpdate
        );
    },
};

module.exports = QuestionsService;
