// Modules
const knex = require("knex");
const app = require("./app");

const { DATABASE_URL, NODE_ENV, PORT } = require("./config");

const db = knex({
    client: "pg",
    connection: DATABASE_URL,
});

// Point app to this knex db instance
app.set("db", db);

app.listen(PORT, () => {
    console.log(
        NODE_ENV === "production"
            ? ""
            : `Server listening at http://localhost:${PORT}`
    );
});
