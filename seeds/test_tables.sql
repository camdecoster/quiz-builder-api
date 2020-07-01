-- DROP the tables and constraints
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS quiz_questions;

DROP TABLE IF EXISTS questions;

DROP TABLE IF EXISTS quizzes;

-- -- Create users first since it doesn't depend on any other table
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(320) NOT NULL UNIQUE,
--     password TEXT NOT NULL,
--     date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- -- Create quizzes
-- CREATE TABLE quizzes (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE
--     SET
--         NULL,
--         title TEXT NOT NULL,
--         author TEXT NOT NULL,
--         description TEXT NOT NULL,
--         color_background TEXT NOT NULL DEFAULT 'black',
--         color_text TEXT NOT NULL DEFAULT 'white',
--         image_url TEXT,
--         image_title TEXT,
--         final_message_low TEXT NOT NULL,
--         final_message_medium TEXT NOT NULL,
--         final_message_high TEXT NOT NULL,
--         final_message_perfect TEXT NOT NULL,
--         date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- -- Create questions next  since it only depends on users
-- CREATE TABLE questions (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE
--     SET
--         NULL,
--         quiz_id INTEGER REFERENCES quizzes(id),
--         question TEXT NOT NULL,
--         answer_index INTEGER NOT NULL,
--         answers TEXT [] NOT NULL,
--         color_background TEXT NOT NULL DEFAULT 'black',
--         color_text TEXT NOT NULL DEFAULT 'white',
--         image_url TEXT,
--         image_title TEXT,
--         date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- CREATE TABLE quiz_questions (
--     quiz_id INTEGER REFERENCES quizzes(id),
--     question_id INTEGER REFERENCES questions(id),
--     PRIMARY KEY (quiz_id, question_id)
-- );