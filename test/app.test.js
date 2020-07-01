const app = require("../src/app");

describe("App", () => {
    it("GET / responds with 200 containing welcome message", () => {
        return supertest(app)
            .get("/")
            .expect(
                200,
                "Welcome to the Quiz Builder API! Go to https://quiz-builder-client.vercel.app to start using it."
            );
    });
});
