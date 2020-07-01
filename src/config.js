module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://et_mod@localhost/expense-tracker",
    JWT_SECRET: process.env.JWT_SECRET || "marblerumfingertoast",
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
};
