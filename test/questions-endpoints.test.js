// Modules
const app = require("../src/app");
const knex = require("knex");
const { expect } = require("chai");

// Configuration
const helpers = require("./test-helpers");
const { firstLetterUppercase } = require("../src/utilities/js-utilities");

// Set up test specific information
const { testUsers, testQuizzes, testQuestions } = helpers.makeFixtures();
const testItems = testQuestions;

const itemsForTest = "questions";
const itemForTest = "question";

const maliciousItemLabel = "testQuestion";
const maliciousItemNames = ["maliciousQuestion", "expectedQuestion"];
const maliciousItemTestProps = ["question", "answers", "image_title"];

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

const itemForPostAttempt = {
    quiz_id: 1,
    question: "test question",
    answer_index: 0,
    answers: ["test1", "test2", "test3", "test4"],
    color_background: "test color_background",
    color_text: "test color_text",
    image_url: "test image_url",
    image_title: "test image_title",
};

describe(`${itemsForTest} Endpoints`, function () {
    let db;

    // Connect to DB
    before(() => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set("db", db);
    });

    after("disconnect from db", () => db.destroy());

    before("cleanup", () => helpers.cleanTables(db));

    afterEach("cleanup", () => helpers.cleanTables(db));

    describe(`GET /api/${itemsForTest}`, () => {
        context(`Given no ${itemsForTest}`, () => {
            beforeEach(() => helpers.seedTables.users(db, testUsers));
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get(`/api/${itemsForTest}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
        });

        context(`Given there are ${itemsForTest} in the database`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds with 200 and all of the ${itemsForTest}`, () => {
                const filteredItems = testItems.filter(
                    (item) => item.user_id === testUsers[0].id
                );
                // Omit user_id from expected items
                const expectedItems = filteredItems.map((item) =>
                    helpers.makeExpected[itemForTest](item)
                );
                return supertest(app)
                    .get(`/api/${itemsForTest}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedItems);
            });
        });

        context(`Given an XSS attack ${itemForTest}`, () => {
            // Get item info for test
            const testInfo = {
                testUser: testUsers[0],
                testQuiz: testQuizzes[0],
                testQuestion: testQuestions[0],
            };

            const testUser = testUsers[0];
            const testQuiz = testQuizzes[0];
            const testQuestion = testQuestions[0];

            // Create malicious item, expected item
            const maliciousItemInfo = helpers.makeMalicious[itemForTest](
                testUser,
                testQuiz,
                testQuestion
            );
            const maliciousItem = maliciousItemInfo[maliciousItemNames[0]];
            const expectedItem = maliciousItemInfo[maliciousItemNames[1]];

            // Replace item in testInfo with maliciousItem
            testInfo[maliciousItemLabel] = maliciousItem;

            beforeEach(`insert malicious ${itemForTest}`, () => {
                console.log(itemForTest);
                return helpers.seedMalicious[itemForTest](
                    db,
                    testInfo.testUser,
                    testInfo.testQuiz,
                    testInfo.testQuestion
                );
            });

            it("removes XSS attack content", () => {
                return supertest(app)
                    .get(`/api/${itemsForTest}`)
                    .set("Authorization", helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect((res) => {
                        maliciousItemTestProps.forEach((prop) =>
                            expect(res.body[0][prop]).to.eql(expectedItem[prop])
                        );
                    });
            });
        });
    });

    describe(`GET /api/${itemsForTest}/:${itemForTest}_id`, () => {
        context(`Given no ${itemsForTest}`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds with 404`, () => {
                const itemId = 123456;
                return supertest(app)
                    .get(`/api/${itemsForTest}/${itemId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: {
                            message: `${firstLetterUppercase(
                                itemForTest
                            )} ID doesn't exist`,
                        },
                    });
            });
        });

        context(`Given there are ${itemsForTest} in the database`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds with 200 and the specified ${itemForTest}`, () => {
                const itemId = 2;
                const expectedItem = helpers.makeExpected[itemForTest](
                    testItems[itemId - 1]
                );

                return supertest(app)
                    .get(`/api/${itemsForTest}/${itemId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedItem);
            });
        });

        context(`Given an XSS attack ${itemForTest}`, () => {
            // Get item info for test
            const testInfo = {
                testUser: testUsers[0],
                testQuiz: testQuizzes[0],
                testQuestion: testQuestions[0],
            };

            const testUser = testUsers[0];
            const testQuiz = testQuizzes[0];
            const testQuestion = testQuestions[0];

            // Create malicious item, expected item
            const maliciousItemInfo = helpers.makeMalicious[itemForTest](
                testUser,
                testQuiz,
                testQuestion
            );
            const maliciousItem = maliciousItemInfo[maliciousItemNames[0]];
            const expectedItem = maliciousItemInfo[maliciousItemNames[1]];

            // Replace item in testInfo with maliciousItem
            testInfo[maliciousItemLabel] = maliciousItem;

            beforeEach(`insert malicious ${itemForTest}`, () => {
                return helpers.seedMalicious[itemForTest](
                    db,
                    testInfo.testUser,
                    testInfo.testQuiz,
                    testInfo.testQuestion
                );
            });

            it("removes XSS attack content", () => {
                return supertest(app)
                    .get(`/api/${itemsForTest}/${maliciousItem.id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect((res) => {
                        maliciousItemTestProps.forEach((prop) =>
                            expect(res.body[prop]).to.eql(expectedItem[prop])
                        );
                    });
            });
        });
    });

    describe(`POST /api/${itemsForTest}`, () => {
        context(`${firstLetterUppercase(itemForTest)} Validation`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            requiredProps.forEach((prop) => {
                const postAttemptBody = { ...itemForPostAttempt };

                it(`responds with 400 required error when '${prop}' is missing`, () => {
                    delete postAttemptBody[prop];
                    // console.log(postAttemptBody);

                    return supertest(app)
                        .post(`/api/${itemsForTest}`)
                        .set(
                            "Authorization",
                            helpers.makeAuthHeader(testUsers[0])
                        )
                        .send(postAttemptBody)
                        .expect(400, {
                            error: {
                                message: `Missing '${prop}' in request body`,
                            },
                        });
                });
            });

            // This test isn't needed for now, but might be in the future if quiz titles have to be unique
            // it(`responds 400 '${firstLetterUppercase(
            //     itemForTest
            // )} title '[title]' already used' when title isn't unique`, () => {
            //     const duplicateItem = {
            //         ...itemForPostAttempt,
            //         title: testItems[0].title,
            //     };

            //     return supertest(app)
            //         .post(`/api/${itemsForTest}`)
            //         .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            //         .send(duplicateItem)
            //         .expect(400, {
            //             error: {
            //                 message: `${firstLetterUppercase(
            //                     itemForTest
            //                 )} name '${duplicateItem.title}' already used`,
            //             },
            //         });
            // });
        });

        context(`Happy path`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds 201 with sanitized ${itemForTest}, storing ${itemForTest}`, () => {
                const newItem = { ...itemForPostAttempt };
                return supertest(app)
                    .post(`/api/${itemsForTest}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .send(newItem)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).to.have.property("id");
                        requiredProps.forEach((prop) =>
                            expect(res.body[prop]).to.eql(newItem[prop])
                        );

                        expect(res.headers.location).to.eql(
                            `/${itemsForTest}/${res.body.id}`
                        );
                        const expectedDate = new Date().toLocaleString("en", {
                            timeZone: "UTC",
                        });
                        const actualDate = new Date(
                            res.body.date_modified
                        ).toLocaleString();
                        expect(actualDate).to.eql(expectedDate);
                    })
                    .expect((res) =>
                        db
                            .from(itemsForTest)
                            .select("*")
                            .where({ id: res.body.id })
                            .first()
                            .then((row) => {
                                expect(row[requiredProps[0]]).to.eql(
                                    newItem[requiredProps[0]]
                                );
                                const expectedDate = new Date().toLocaleString(
                                    "en",
                                    { timeZone: "UTC" }
                                );
                                const actualDate = new Date(
                                    row.date_modified
                                ).toLocaleString();
                                expect(actualDate).to.eql(expectedDate);
                            })
                    );
            });
        });
    });

    describe(`PATCH /api/${itemsForTest}/:${itemForTest}_id`, () => {
        context(`${firstLetterUppercase(itemForTest)} Validation`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            requiredProps.forEach((prop) => {
                const patchAttemptBody = { ...testItems[0] };

                it(`responds with 400 required error when '${prop}' is missing`, () => {
                    delete patchAttemptBody[prop];
                    // console.log("patchAttemptBody", patchAttemptBody);

                    return supertest(app)
                        .patch(`/api/${itemsForTest}/${patchAttemptBody.id}`)
                        .set(
                            "Authorization",
                            helpers.makeAuthHeader(testUsers[0])
                        )
                        .send(patchAttemptBody)
                        .expect(400, {
                            error: {
                                message: `Missing '${prop}' in request body`,
                            },
                        });
                });
            });
        });

        context(`Happy path`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds 201 with sanitized ${itemForTest}, storing ${itemForTest}`, () => {
                const itemToUpdate = {
                    ...testItems[0],
                    [requiredProps[1]]: "PATCH TEST",
                };

                return supertest(app)
                    .patch(`/api/${itemsForTest}/${itemToUpdate.id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .send(itemToUpdate)
                    .expect(204)
                    .expect((res) => {
                        db.from(itemsForTest)
                            .select("*")
                            .where({ id: itemToUpdate.id })
                            .first()
                            .then((row) => {
                                requiredProps.forEach((prop) =>
                                    expect(row[prop]).to.eql(itemToUpdate[prop])
                                );
                                const expectedDate = new Date().toLocaleString(
                                    "en",
                                    { timeZone: "UTC" }
                                );
                                const actualDate = new Date(
                                    row.date_modified
                                ).toLocaleString();
                                expect(actualDate).to.eql(expectedDate);
                            });
                    });
            });
        });
    });

    describe(`DELETE /api/${itemsForTest}/:${itemForTest}_id`, () => {
        context(`Happy path`, () => {
            beforeEach(`insert ${itemsForTest}`, () =>
                // Seed database tables; disconnect from original variables
                helpers.seedTables[itemsForTest](
                    db,
                    JSON.parse(JSON.stringify(testUsers)),
                    JSON.parse(JSON.stringify(testQuizzes)),
                    JSON.parse(JSON.stringify(testQuestions))
                )
            );

            it(`responds 204 with ${itemForTest} absent from ${itemsForTest} table`, () => {
                const itemToDelete = {
                    ...testItems[0],
                };

                return supertest(app)
                    .delete(`/api/${itemsForTest}/${itemToDelete.id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .expect((res) =>
                        // Check to make sure deleted item is no longer present
                        db
                            .from(itemsForTest)
                            .select("*")
                            .then((rows) => {
                                rows.forEach(
                                    (row) => row.id !== itemToDelete.id
                                );
                            })
                    );
            });
        });
    });
});
