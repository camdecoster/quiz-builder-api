// Modules
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const knex = require("knex");

// Configuration
const helpers = require("./test-helpers");

describe(`Users endpoints`, function () {
    let db;

    // Get test user info
    const { testUsers } = helpers.makeFixtures();
    const testUser = testUsers[0];

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

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach("insert users", () =>
                helpers.seedTables.users(db, testUsers)
            );

            const requiredFields = ["email", "password"];

            requiredFields.forEach((field) => {
                const registerAttemptBody = {
                    email: "test user_name",
                    password: "test password",
                };

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field];

                    return supertest(app)
                        .post("/api/users")
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        });
                });
            });

            it(`responds 400 'Password must be at least 8 characters long' when empty password`, () => {
                const userShortPassword = {
                    email: "test@test.com",
                    password: "1234567",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(userShortPassword)
                    .expect(400, {
                        error: `Password must be at least 8 characters long`,
                    });
            });

            it(`responds 400 'Password must be at most  72 characters' when long password`, () => {
                const userLongPassword = {
                    email: "test@test.com",
                    password: "*".repeat(73),
                };
                return supertest(app)
                    .post("/api/users")
                    .send(userLongPassword)
                    .expect(400, {
                        error: `Password must be at most 72 characters`,
                    });
            });

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: "test@test.com",
                    password: " 1Aa!2Bb@",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(userPasswordStartsSpaces)
                    .expect(400, {
                        error: `Password must not start or end with empty spaces`,
                    });
            });

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: "test@test.com",
                    password: "1Aa!2Bb@ ",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(userPasswordEndsSpaces)
                    .expect(400, {
                        error: `Password must not start or end with empty spaces`,
                    });
            });

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    email: "test@test.com",
                    password: "11AAaabb",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(userPasswordNotComplex)
                    .expect(400, {
                        error: `Password must contain 1 upper case, lower case, number and special character`,
                    });
            });

            it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
                const duplicateUser = {
                    email: testUser.email,
                    password: "11AAaa!!",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(duplicateUser)
                    .expect(400, { error: `Email already taken` });
            });
        });

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: "test@test.com",
                    password: "11AAaa!!",
                };
                return supertest(app)
                    .post("/api/users")
                    .send(newUser)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).to.have.property("id");
                        expect(res.body.email).to.eql(newUser.email);
                        expect(res.body).to.not.have.property("password");
                        expect(res.headers.location).to.eql(
                            `/api/users/${res.body.id}`
                        );
                        const expectedDate = new Date().toLocaleString("en", {
                            timeZone: "UTC",
                        });
                        const actualDate = new Date(
                            res.body.date_modified
                        ).toLocaleString();
                        console.log("Actual date", actualDate);
                        expect(actualDate).to.eql(expectedDate);
                    })
                    .expect((res) =>
                        db
                            .from("users")
                            .select("*")
                            .where({ id: res.body.id })
                            .first()
                            .then((row) => {
                                expect(row.email).to.eql(newUser.email);
                                const expectedDate = new Date().toLocaleString(
                                    "en",
                                    { timeZone: "UTC" }
                                );
                                const actualDate = new Date(
                                    row.date_modified
                                ).toLocaleString();
                                expect(actualDate).to.eql(expectedDate);

                                return bcrypt.compare(
                                    newUser.password,
                                    row.password
                                );
                            })
                            .then((compareMatch) => {
                                expect(compareMatch).to.be.true;
                            })
                    );
            });
        });
    });
});
