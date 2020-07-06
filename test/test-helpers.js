// Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        questions,
        quizzes,
        users
        RESTART IDENTITY CASCADE`
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const subject = user.email;
    const payload = { user_id: user.id };

    const token = jwt.sign(payload, secret, {
        subject,
        algorithm: "HS256",
    });

    return `Bearer ${token}`;
}

const makeArray = {
    questions(users, quizzes) {
        return [
            {
                id: 1,
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is up?",
                index_quiz_order: 0,
                answer_index: 0,
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 2,
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is down?",
                index_quiz_order: 1,
                answer_index: 1,
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 3,
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is left?",
                index_quiz_order: 2,
                answer_index: 2,
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 4,
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is up?",
                index_quiz_order: 3,
                answer_index: 3,
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 5,
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is the capitol of Oregon?",
                index_quiz_order: 0,
                answer_index: 2,
                answers: ["Portland", "Eugene", "Salem", "Corvallis", "Bend"],
                color_background: "black",
                color_text: "white",
                image_url:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/320px-Flag_of_Oregon.svg.png",
                image_title: "flag of oregon",
                date_modified: "2019-02-03T00:00:00.000Z",
            },
            {
                id: 6,
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is the largest state by area?",
                index_quiz_order: 1,
                answer_index: 0,
                answers: [
                    "Alaska",
                    "Texas",
                    "California",
                    "Rhode Island",
                    "New York",
                    "Florida",
                    "Hawaii",
                    "Montana",
                ],
                color_background: "black",
                color_text: "white",
                image_url:
                    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/320px-Flag_of_the_United_States.svg.png",
                image_title: "flag of united states",
                date_modified: "2019-02-03T00:00:00.000Z",
            },
            {
                id: 7,
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is capitol of Colorado?",
                index_quiz_order: 2,
                answer_index: 3,
                answers: [
                    "Boulder",
                    "Fort Collins",
                    "Colorado Springs",
                    "Denver",
                    "Grand Junction",
                ],
                color_background: "black",
                color_text: "white",
                image_url:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg/320px-Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg.png",
                image_title: "flag of colorado",
                date_modified: "2019-02-03T00:00:00.000Z",
            },
        ];
    },
    quizzes(users) {
        return [
            {
                id: 1,
                user_id: users[0].id,
                title: "Directions Quiz",
                author: "Quiz Guy",
                description: "A quiz about directions",
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                final_message_low: "Not good",
                final_message_medium: "Meh",
                final_message_high: "Pretty good",
                final_message_perfect: "Awesome",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 2,
                user_id: users[0].id,
                title: "United States Geography Quiz",
                author: "Quiz Quizzington",
                description: "Test your knowledge of the State Capitols",
                color_background: "black",
                color_text: "white",
                image_url: "",
                image_title: "",
                final_message_low: "Time to go back to elementary school.",
                final_message_medium: `'I guess that capitols song didn't really quite stick.`,
                final_message_high: `Someone's been looking at maps lately.`,
                final_message_perfect: `We've got a walking atlas here!`,
                date_modified: "2019-01-03T00:00:00.000Z",
            },
        ];
    },
    users() {
        return [
            {
                id: 1,
                email: "testuser_1@test.com",
                password:
                    "$2a$12$w2aSK3YEXlnHumDCL9vcee14606sdY8O9pTFUT9QTVoRXe.ZTiCmS",
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: 2,
                email: "testuser_2@test.com",
                password:
                    "$2a$12$ItuUP/dRZgoFnfy5J1tmnuzX9sVQ1/68RC1s3Krp5ZHOC1HkJoS7e",
                date_modified: "2018-08-15T23:00:00.000Z",
            },
        ];
    },
};

const makeExpected = {
    question(question) {
        // Get rid of user_id, return other properties
        const { user_id, ...otherProps } = question;
        return {
            ...otherProps,
        };
    },
    quiz(quiz) {
        // Get all questions
        const { testQuestions } = makeFixtures();

        // Filter to quiz
        const filteredQuestions = testQuestions.filter(
            (question) => question.quiz_id === quiz.id
        );

        // Get rid of user_id
        questions = filteredQuestions.map((question) => {
            delete question.user_id;
            return question;
        });

        // Add questions to quiz
        quiz.questions = questions;

        // Get rid of quiz user_id
        delete quiz.user_id;

        return quiz;
    },
};

function makeFixtures() {
    const testUsers = makeArray.users();
    const testQuizzes = makeArray.quizzes(testUsers);
    const testQuestions = makeArray.questions(testUsers, testQuizzes);
    return { testUsers, testQuizzes, testQuestions };
}

const makeMalicious = {
    question(user, quiz) {
        const maliciousQuestion = {
            id: 1,
            user_id: user.id,
            quiz_id: quiz.id,
            question: 'What is up? <script>alert("xss");</script>',
            answer_index: 0,
            answers: [
                "Up",
                "Down",
                "Left",
                'Right <script>alert("xss");</script>',
            ],
            color_background: "black",
            color_text: "white",
            image_url: "",
            image_title:
                '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
            date_modified: "2019-01-03T00:00:00.000Z",
        };
        const expectedQuestion = {
            id: 1,
            user_id: user.id,
            quiz_id: quiz.id,
            question: 'What is up? &lt;script&gt;alert("xss");&lt;/script&gt;',
            answer_index: 0,
            answers: [
                "Up",
                "Down",
                "Left",
                'Right &lt;script&gt;alert("xss");&lt;/script&gt;',
            ],
            color_background: "black",
            color_text: "white",
            image_url: "",
            image_title: '<img src="https://url.to.file.which/does-not.exist">',
            date_modified: "2019-01-03T00:00:00.000Z",
        };
        return { maliciousQuestion, expectedQuestion };
    },
    quiz(user) {
        const maliciousQuiz = {
            id: 1,
            user_id: user.id,
            title: 'Directions Quiz <script>alert("xss");</script>',
            author: 'Quiz Guy <script>alert("xss");</script>',
            description: "A quiz about directions",
            color_background: "black",
            color_text: "white",
            image_url: "",
            image_title:
                '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
            final_message_low: "Not good",
            final_message_medium: "Meh",
            final_message_high: "Pretty good",
            final_message_perfect: "Awesome",
            date_modified: "2019-01-03T00:00:00.000Z",
        };
        const expectedQuiz = {
            id: 1,
            user_id: user.id,
            title: 'Directions Quiz &lt;script&gt;alert("xss");&lt;/script&gt;',
            author: 'Quiz Guy &lt;script&gt;alert("xss");&lt;/script&gt;',
            description: "A quiz about directions",
            color_background: "black",
            color_text: "white",
            image_url: "",
            image_title: '<img src="https://url.to.file.which/does-not.exist">',
            final_message_low: "Not good",
            final_message_medium: "Meh",
            final_message_high: "Pretty good",
            final_message_perfect: "Awesome",
            date_modified: "2019-01-03T00:00:00.000Z",
        };
        return { maliciousQuiz, expectedQuiz };
    },
};

const seedTables = {
    questions(db, users, quizzes, questions) {
        // Remove id to keep DB keys in sync
        questions.forEach((question) => delete question.id);

        return seedTables
            .users(db, users)
            .then(() => db.into("quizzes").insert(quizzes))
            .then(() => db.into("questions").insert(questions));
    },
    quizzes(db, users, quizzes, questions) {
        // Remove id to keep DB keys in sync
        quizzes.forEach((quiz) => delete quiz.id);
        // questions.forEach((question) => delete question.id);

        return seedTables
            .users(db, users)
            .then(() => db.into("quizzes").insert(quizzes))
            .then(() => db.into("questions").insert(questions));
    },
    users(db, users) {
        const preppedUsers = users.map((user) => ({
            ...user,
            password: bcrypt.hashSync(user.password, 1),
        }));
        return db
            .into("users")
            .insert(preppedUsers)
            .then(() =>
                // update the auto sequence to stay in sync
                db.raw(`SELECT setval('users_id_seq', ?)`, [
                    users[users.length - 1].id,
                ])
            );
    },
};

const seedMalicious = {
    question(db, user, quiz, question) {
        return seedTables
            .users(db, [user])
            .then(() => db.into("quizzes").insert([quiz]))
            .then(() => db.into("questions").insert([question]));
    },
    quiz(db, user, quiz, question) {
        return seedTables
            .users(db, [user])
            .then(() => db.into("quizzes").insert([quiz]));
    },
};

module.exports = {
    cleanTables,
    makeArray,
    makeAuthHeader,
    makeExpected,
    makeFixtures,
    makeMalicious,
    seedMalicious,
    seedTables,
};
