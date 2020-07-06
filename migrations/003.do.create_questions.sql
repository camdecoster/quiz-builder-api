CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    index_quiz_order INTEGER NOT NULL,
    answer_index INTEGER NOT NULL,
    answers TEXT [] NOT NULL,
    color_background TEXT NOT NULL DEFAULT 'black',
    color_text TEXT NOT NULL DEFAULT 'white',
    image_url TEXT,
    image_title TEXT,
    date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
);