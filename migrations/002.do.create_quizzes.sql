CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    color_background TEXT NOT NULL DEFAULT 'black',
    color_text TEXT NOT NULL DEFAULT 'white',
    image_url TEXT,
    image_title TEXT,
    final_message_low TEXT NOT NULL,
    final_message_medium TEXT NOT NULL,
    final_message_high TEXT NOT NULL,
    final_message_perfect TEXT NOT NULL,
    date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
);