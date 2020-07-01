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
                id: "1",
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is up?",
                answer_index: "0",
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: null,
                image_title: null,
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: "2",
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is down?",
                answer_index: "1",
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: null,
                image_title: null,
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: "3",
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                question: "What is left?",
                answer_index: "2",
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: null,
                image_title: null,
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: "4",
                user_id: users[0].id,
                quiz_id: quizzes[0].id,
                questions: "What is up?",
                answer_index: "3",
                answers: ["Up", "Down", "Left", "Right"],
                color_background: "black",
                color_text: "white",
                image_url: null,
                image_title: null,
                date_modified: "2019-01-03T00:00:00.000Z",
            },
            {
                id: "5",
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is the capitol of Oregon?",
                answer_index: "2",
                answers: ["Portland", "Eugene", "Salem", "Corvallis", "Bend"],
                color_background: "black",
                color_text: "white",
                image_url:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/320px-Flag_of_Oregon.svg.png",
                image_title: "flag of oregon",
                date_modified: "2019-02-03T00:00:00.000Z",
            },
            {
                id: "6",
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is the largest state by area?",
                answer_index: "0",
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
                id: "7",
                user_id: users[0].id,
                quiz_id: quizzes[1].id,
                question: "What is capitol of Colorado?",
                answer_index: "3",
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
    quiz(quiz) {
        // Get rid of user_id, return other properties
        const { user_id, ...otherProps } = quiz;
        return {
            ...otherProps,
        };
    },
    expense(expense) {
        return {
            id: expense.id,
            date: expense.date,
            type: expense.type,
            amount: expense.amount,
            payee: expense.payee,
            category: expense.category,
            payment_method: expense.payment_method,
            description: expense.description,
            date_created: expense.date_created,
            date_modified: expense.date_modified,
        };
    },
    payment_method(payment_method) {
        return {
            id: payment_method.id,
            payment_method_name: payment_method.payment_method_name,
            cycle_type: payment_method.cycle_type,
            cycle_start: payment_method.cycle_start,
            cycle_end: payment_method.cycle_end,
            description: payment_method.description,
            date_created: payment_method.date_created,
            date_modified: payment_method.date_modified,
        };
    },
};

function makeFixtures() {
    const testUsers = makeArray.users();
    const testQuizzes = makeArray.quizzes(testUsers);
    const testQuestions = makeArray.questions(testUsers, testQuizzes);
    return { testUsers, testQuizzes, testQuestions };
}

const makeMalicious = {
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
    category(user) {
        const maliciousCategory = {
            id: 911,
            user_id: user.id,
            category_name:
                'Malicious category_name <script>alert("xss");</script>',
            type: 'Malicious type <script>alert("xss");</script>',
            amount: "254.60",
            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
            date_created: new Date().toISOString(),
        };
        const expectedCategory = {
            ...maliciousCategory,
            category_name:
                'Malicious category_name &lt;script&gt;alert("xss");&lt;/script&gt;',
            type: 'Malicious type &lt;script&gt;alert("xss");&lt;/script&gt;',
            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist">',
        };
        return {
            maliciousCategory,
            expectedCategory,
        };
    },
    expense(user, category, payment_method) {
        const maliciousExpense = {
            id: 911,
            user_id: user.id,
            date: new Date().toISOString(),
            type: 'Malicious type <script>alert("xss");</script>',
            amount: "254.60",
            payee: 'Malicious payee <script>alert("xss");</script>',
            category: category.id,
            payment_method: payment_method.id,
            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
            date_created: new Date().toISOString(),
        };
        const expectedExpense = {
            ...maliciousExpense,
            type: 'Malicious type &lt;script&gt;alert("xss");&lt;/script&gt;',
            payee: 'Malicious payee &lt;script&gt;alert("xss");&lt;/script&gt;',

            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist">',
        };
        return {
            maliciousExpense,
            expectedExpense,
        };
    },
    payment_method(user) {
        const maliciousPayment_method = {
            id: 911,
            user_id: user.id,
            payment_method_name:
                'Malicious payment_method_name <script>alert("xss");</script>',
            cycle_type: 'Malicious cycle_type <script>alert("xss");</script>',
            cycle_start: 5,
            cycle_end: 4,
            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
            date_created: new Date().toISOString(),
        };
        const expectedPayment_method = {
            ...maliciousPayment_method,
            payment_method_name:
                'Malicious payment_method_name &lt;script&gt;alert("xss");&lt;/script&gt;',
            cycle_type:
                'Malicious cycle_type &lt;script&gt;alert("xss");&lt;/script&gt;',
            description:
                'Malicious description <img src="https://url.to.file.which/does-not.exist">',
        };
        return {
            maliciousPayment_method,
            expectedPayment_method,
        };
    },
};

const seedTables = {
    categories(db, users, categories) {
        // Seed users, then seed categories
        return seedTables
            .users(db, users)
            .then(() => db.into("categories").insert(categories));
    },
    expenses(db, users, categories, payment_methods, expenses) {
        // Seed users, then categories, then payment_methods, then expenses
        return seedUsers(db, users)
            .then(() => db.into("categories").insert(categories))
            .then(() => db.into("payment_methods").insert(payment_methods))
            .then(() => db.into("expenses").insert(expenses));
    },
    payment_methods(db, users, payment_methods) {
        // Seed users, then seed payment methods
        return seedUsers(db, users).then(() =>
            db.into("payment_methods").insert(payment_methods)
        );
    },
    quizzes(db, users, quizzes, questions) {
        return seedTables
            .users(db, users)
            .then(() => db.into("quizzes").insert(quizzes));
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
    quiz(db, user, quiz) {
        return seedTables
            .users(db, [user])
            .then(() => db.into("quizzes").insert([quiz]));
    },
    category(db, user, category) {
        return seedUsers(db, [user]).then(() =>
            db.into("categories").insert([category])
        );
    },
    expense(db, user, category, payment_method, expense) {
        return seedUsers(db, [user])
            .then(() => db.into("categories").insert([category]))
            .then(() => db.into("payment_methods").insert([payment_method]))
            .then(() => db.into("expenses").insert([expense]));
    },
    payment_method(db, user, payment_method) {
        return seedUsers(db, [user]).then(() =>
            db.into("payment_methods").insert([payment_method])
        );
    },
};

// function seedUsers(db, users) {
//     const preppedUsers = users.map((user) => ({
//         ...user,
//         password: bcrypt.hashSync(user.password, 1),
//     }));
//     return db
//         .into("users")
//         .insert(preppedUsers)
//         .then(() =>
//             // update the auto sequence to stay in sync
//             db.raw(`SELECT setval('users_id_seq', ?)`, [
//                 users[users.length - 1].id,
//             ])
//         );
// }

module.exports = {
    cleanTables,
    makeArray,
    makeAuthHeader,
    makeExpected,
    makeFixtures,
    makeMalicious,
    seedMalicious,
    seedTables,
    // seedUsers,
};
