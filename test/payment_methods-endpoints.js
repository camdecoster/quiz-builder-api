// Modules
const app = require("../src/app");
const knex = require("knex");

// Configuration
const helpers = require("./test-helpers");

describe("Payment Methods Endpoints", function () {
    let db;

    const { testUsers, testPayment_methods } = helpers.makeFixtures();

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

    describe(`GET /api/payment-methods`, () => {
        context(`Given no payment methods`, () => {
            beforeEach(() => helpers.seedTables.users(db, testUsers));
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/api/payment-methods")
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
        });

        context("Given there are payment methods in the database", () => {
            beforeEach("insert payment methods", () =>
                helpers.seedTables.payment_methods(
                    db,
                    testUsers,
                    testPayment_methods
                )
            );

            it("responds with 200 and all of the payment methods", () => {
                const filteredPayment_methods = testPayment_methods.filter(
                    (payment_method) =>
                        payment_method.user_id === testUsers[0].id
                );
                // Omit user_id from expected payment methods
                const expectedPayment_methods = filteredPayment_methods.map(
                    (payment_method) =>
                        helpers.makeExpected.payment_method(payment_method)
                );
                return supertest(app)
                    .get("/api/payment-methods")
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedPayment_methods);
            });
        });

        context(`Given an XSS attack payment method`, () => {
            const testUser = testUsers[1];
            const {
                maliciousPayment_method,
                expectedPayment_method,
            } = helpers.makeMalicious.payment_method(testUser);

            beforeEach("insert malicious payment method", () => {
                return helpers.seedMalicious.payment_method(
                    db,
                    testUser,
                    maliciousPayment_method
                );
            });

            it("removes XSS attack content", () => {
                return supertest(app)
                    .get("/api/payment-methods")
                    .set("Authorization", helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect((res) => {
                        expect(res.body[0].payment_method_name).to.eql(
                            expectedPayment_method.payment_method_name
                        );
                        expect(res.body[0].type).to.eql(
                            expectedPayment_method.type
                        );
                        expect(res.body[0].description).to.eql(
                            expectedPayment_method.description
                        );
                    });
            });
        });
    });

    describe(`GET /api/payment-methods/:payment_method_id`, () => {
        context(`Given no payment methods`, () => {
            beforeEach(() => helpers.seedTables.users(db, testUsers));

            it(`responds with 404`, () => {
                const payment_methodId = 123456;
                return supertest(app)
                    .get(`/api/payment-methods/${payment_methodId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: `Payment Method doesn't exist` });
            });
        });

        context("Given there are payment methods in the database", () => {
            beforeEach("insert payment methods", () =>
                helpers.seedTables.payment_methods(
                    db,
                    testUsers,
                    testPayment_methods
                )
            );

            it("responds with 200 and the specified payment method", () => {
                const payment_methodId = 2;
                const expectedPayment_method = helpers.makeExpected.payment_method(
                    testPayment_methods[payment_methodId - 1]
                );

                return supertest(app)
                    .get(`/api/payment-methods/${payment_methodId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedPayment_method);
            });
        });

        context(`Given an XSS attack payment method`, () => {
            const testUser = testUsers[1];
            const {
                maliciousPayment_method,
                expectedPayment_method,
            } = helpers.makeMalicious.payment_method(testUser);

            beforeEach("insert malicious payment method", () => {
                return helpers.seedMalicious.payment_method(
                    db,
                    testUser,
                    maliciousPayment_method
                );
            });

            it("removes XSS attack content", () => {
                return supertest(app)
                    .get(`/api/payment-methods/${maliciousPayment_method.id}`)
                    .set("Authorization", helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.payment_method_name).to.eql(
                            expectedPayment_method.payment_method_name
                        );
                        expect(res.body.type).to.eql(
                            expectedPayment_method.type
                        );
                        expect(res.body.description).to.eql(
                            expectedPayment_method.description
                        );
                    });
            });
        });
    });
});
